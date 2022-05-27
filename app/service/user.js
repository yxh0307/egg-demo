
const Service = require('egg').Service
const jsonwebtoken = require('jsonwebtoken')

class UserService extends Service {
    get User() {
        return this.app.model.User
    }

    // 查找用户
    async findUsername(username) {
        return this.User.findOne({username})
    }

    // 查找邮箱
    async findEmail(email) {
        return this.User.findOne({email}).select('+password')
    }

    // 创建用户
    async createUser(data) {
        data.password = this.ctx.helper.md5(data.password)
        const user = new this.User(data)
        await user.save() // 保存到数据库中
        return user
    }
    
    // 创建token
    async createToken(data) {
        return jsonwebtoken.sign(data, this.app.config.key.secret, {
            expiresIn: this.app.config.key.expiresIn
        })
    }

    // 更新用户
    updateUser(data) {
        return this.User.findByIdAndUpdate(this.ctx.user._id, data, {
          new: true // 返回更新之后的数据
        })
    }

    // 验证token
    validToken(token) {
        return jsonwebtoken.verify(token, this.app.config.key.secret)
    }

    // 通过id查找数据
    findById(id) {
        return this.User.findOne({_id: id})
    }
}

module.exports = UserService