module.exports = function(config) {
  if (process.env.NODE_ENV === "development" && config.devServer) {
    config.devServer.proxy = [
      {
        // proxy requests matching a pattern:
        path: "/auth/**",

        // where to proxy to:
        target: "http://localhost:3000"
      },
      {
        // proxy requests matching a pattern:
        path: "/api/**",

        // where to proxy to:
        target: "http://localhost:3000"
      }
    ];
  }
};
