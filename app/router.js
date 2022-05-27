'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;

  const auth = middleware.auth();

  router.prefix('/egg') // 设置前缀

  router.get('/', controller.home.index);

  router
    .post('/create', controller.user.create)
    .post('/login', controller.user.login)
    .patch('/update', auth, controller.user.update)
};
