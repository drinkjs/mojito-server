module.exports = {
  apps: [
    {
      name: "mojito-server",
      script: "./src/main.ts",
      interpreter: 'node',
      interpreterArgs: '--loader ./es-loader.js',
      exec_mode: "cluster",
      watch: false,
      autorestart: false,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
