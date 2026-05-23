module.exports = {
  apps : [{
    name      : 'sales-api',
    cwd       : 'apps/backend',
    script    : 'app.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/main',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && npm run build && pm2 reload apps/backend/ecosystem.config.js --env production'
    }
  }
};
