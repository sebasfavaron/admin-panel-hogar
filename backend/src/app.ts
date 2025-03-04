import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from '../config/database';
import { setupAssociations } from '../models/associations';
import collaboratorRoutes from '../routes/collaboratorRoutes';
import donationRoutes from '../routes/donationRoutes';
import emailCampaignRoutes from '../routes/emailCampaignRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/collaborators', collaboratorRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/email-campaigns', emailCampaignRoutes);

// Health check endpoint with DB check
app.get('/health', async (req, res) => {
  try {
    await sequelize.query('SELECT 1+1 AS result');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database connection and models
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Initialize model associations
    setupAssociations();
    
    // Sync models with database (only in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized successfully.');
    }
  } catch (error) {
    console.error('Unable to initialize database:', error);
    // Don't exit process, let Express handle the error state
  }
}

initializeDatabase();

export default app;
