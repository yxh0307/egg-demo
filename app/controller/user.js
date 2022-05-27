
const Controller = require('egg').Controller;

class HomeController extends Controller {

  // 创建用户
  async create() {
    const {ctx} = this;

    // 获取传入的body
    const body = ctx.request.body

    ctx.validate({
      username: { type: 'string' },
      email: { type: 'email' },
      password: { type: 'string' }
    })

    const userService = this.service.user

    // 校验名字是否存在
    if (await userService.findUsername(body.username)) {
      ctx.throw(422, 'Validation Failed', {
        errors: [
          {
            code: 'invalid',
            field: 'username',
            message: '用户已存在'
          }
        ]
      })
    }

    // 验证邮箱是否存在
    if (await userService.findEmail(body.email)) {
      ctx.throw(422, 'Validation Failed', {
        errors: [
          {
            code: 'invalid',
            field: 'email',
            message: '邮箱已存在'
          }
        ]
      })
    }

    // 新建用户
    const user = await userService.createUser(body)

    // 生成token
    const token = await userService.createToken({userId: user._id})

    // 返回数据
    ctx.body = {
      user: {
        email: user.email,
        token,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar
      }
    }
  }

  // 用户登录
  async login() {
    const {ctx} = this;
    
    const {body} = ctx.request
    // 验证数据
    ctx.validate({
      email: { type: 'email', required: true },
      password: { type: 'string', required: true }
    }, body)

    const userService = this.service.user
    
    // 根据邮箱获取数据
    const user = await userService.findEmail(body.email)
    if (!user) {
      this.ctx.throw(422, 'Validation Failed', {
        errors: [
          {
            code: 'invalid',
            field: 'email',
            message: '邮箱不存在'
          }
        ]
      })
    }

    // 验证密码是否正确
    if (ctx.helper.md5(body.password) !== user.password) {
      this.ctx.throw(422, 'Validation Failed', {
        errors: [
          {
            code: 'invalid',
            field: 'email',
            message: '密码不正确'
          }
        ]
      })
    }

    // 创建token
    const token = await userService.createToken({userId: user._id})

    // 返回数据
    ctx.body = {
      user: {
        email: user.email,
        token,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar
      }
    }
  }

  // 更新用户
  async update () {

    const {ctx, service} = this
    // 1. 基本数据验证
    const body = ctx.request.body
    
    ctx.validate({
      email: { type: 'email', required: false },
      password: { type: 'string', required: false },
      username: { type: 'string', required: false },
      channelDescription: { type: 'string', required: false },
      avatar: { type: 'string', required: false }
    }, body)

    const userService = service.user

    // 验证用户名是否存在
    if (body.username) {
      if (body.username === ctx.user.username || await userService.findUsername(body.username)) {
        ctx.throw(422, '用户名已存在')
      }
    }

    // 验证密码邮箱是否存在
    if (body.email) {
      if (body.email === ctx.user.email || await userService.findEmail(body.email)) {
        ctx.throw(422, '邮箱已存在')
      }
    }

    if (body.password) body.password = ctx.helper.md5(body.password)

    // 更新用户信息
    const user = await userService.updateUser(body)

    // 返回更新之后的用户信息
    ctx.body = {
      user: {
        email: user.email,
        password: user.password,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar
      }
    }
  }
}

module.exports = HomeController;