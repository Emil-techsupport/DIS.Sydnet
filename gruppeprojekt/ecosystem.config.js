// PM2 Ecosystem konfiguration
// Kører din app på flere porte for load balancing
// altdi brug: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "backend",
      script: "./bin/www",
      env: {
        PORT: 4000,
        NODE_ENV: "production"
      }
    }
  ]
};
