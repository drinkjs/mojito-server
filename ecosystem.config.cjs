module.exports = {
  apps: [
    {
      name: "mojito-server",
      script: "./src/main.ts",
      interpreter: 'node',
      interpreterArgs: '--loader ./es-loader.js',
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
