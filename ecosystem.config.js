module.exports = {
  apps: [
    {
      name: 'dispatch-app',
      script: 'npm',
      args: 'start',
      cwd: '/opt/dispatch',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3333
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3333
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 8000
    }
  ],

  deploy: {
    production: {
      user: 'root',
      host: 'dispatch.forbush.biz',
      ref: 'origin/master',
      repo: 'git@github.com:mcnfch/dispatch-demo.git',
      path: '/opt/dispatch',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
