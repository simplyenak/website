module.exports = {
  apps: [{
    name: 'payload-dev',
    cwd: '/var/home/maarten/website-optimization/payload-local',
    script: 'npx',
    args: 'next dev --webpack',
    interpreter: 'none',
    restart_delay: 3000,
    max_restarts: 10,
    min_uptime: '10s',
    env: {
      NODE_ENV: 'development',
    },
  }]
};
