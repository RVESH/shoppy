const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/shoppy_backend',
    createProxyMiddleware({
      target: 'https://shoppy.page.gd',
      changeOrigin: true,
      secure: false,
    })
  );
};