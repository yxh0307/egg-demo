
module.exports = () => {
  return async (ctx, next) => {
    // 获取请求头中的 token
    const token = ctx.headers.authorization
    if (token) {
      try {
        // 验证token
        const data = await ctx.service.user.validToken(token)
        ctx.user = await ctx.model.User.findById(data.userId)
      } catch(err) {
        ctx.throw(401)
      }
    } else {
      ctx.throw(401)
    }
    // 往后执行
    await next()
  }
}