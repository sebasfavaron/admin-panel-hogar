require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/orphanage-db',
    dialect: 'postgres',
  },
  test: {
    url:
      process.env.DATABASE_URL || 'postgres://localhost:5432/orphanage-db-test',
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
