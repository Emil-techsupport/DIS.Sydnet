// PM2 Ecosystem konfiguration
// Kører din app på flere porte for load balancing
// Brug: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'app-server1',
      script: './bin/www',
      env: {
        PORT: 4000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'app-server2',
      script: './bin/www',
      env: {
        PORT: 4001,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'app-server3',
      script: './bin/www',
      env: {
        PORT: 4002,
        NODE_ENV: 'production'
      }
    }
  ]
};


