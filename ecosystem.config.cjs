module.exports = {
  apps: [
    {
      name: "mojito-server",
      script: "./src/main.ts",
      interpreter: 'node',
      interpreterArgs: '--loader tsx',
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
