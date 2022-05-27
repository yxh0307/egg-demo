
module.exports = () => {
    return async (ctx, next) => {
        try {
            await next()
        }   catch(err) {
            ctx.app.emit('error', err, ctx)

            const status = ctx.status || 500
            // 500时候可能包含敏感信息
            const error =
                status === 500 && ctx.app.config.env === 'prod'
                ? '网络异常'
                : err.message

            ctx.body = {error}
            if (status === 422) {
                ctx.body.detail = err.errors
            }
            ctx.status = status
        }
    }
}