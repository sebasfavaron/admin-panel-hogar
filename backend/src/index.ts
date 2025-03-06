import app from './app';
import sequelize from '../config/database';

const PORT = process.env.PORT || 3333;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
