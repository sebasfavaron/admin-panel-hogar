import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl =
  process.env.DATABASE_URL || 'postgres://localhost:5432/orphanage-db';

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === 'production'
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test the connection and handle errors gracefully
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Test query to ensure we can actually query the database
    await sequelize.query('SELECT 1+1 AS result');
    console.log('Database query test successful.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Don't exit the process, let the application handle the error gracefully
    throw error;
  }
};

testConnection().catch(console.error);

export default sequelize;
