module.exports = {
  apps: [
    {
      name: "mojito-server",
      script: "./dist/main.js",
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
