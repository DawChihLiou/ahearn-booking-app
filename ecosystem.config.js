module.exports = {
  apps: [
    {
      name: "beta_web",
      script: "npm",
      args: "start",
      merge_logs: true,
      exec_mode: "cluster",
      instances: "max",
      increment_var: "PORT",
      env: {
        PORT: 3000,
      },
    },
  ],
};
