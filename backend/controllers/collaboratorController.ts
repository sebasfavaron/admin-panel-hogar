import { Request, Response } from 'express';
import Collaborator from '../models/Collaborator';

export const getCollaborators = async (req: Request, res: Response) => {
  try {
    console.log('Attempting to fetch collaborators...');
    const collaborators = await Collaborator.findAll().catch((err) => {
      console.error('Database query error:', err);
      throw err;
    });

    console.log(`Found ${collaborators?.length || 0} collaborators`);
    res.json(collaborators || []);
  } catch (error) {
    console.error('Error in getCollaborators:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({
      error: 'Error fetching collaborators',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getCollaborator = async (req: Request, res: Response) => {
  try {
    const collaborator = await Collaborator.findByPk(req.params.id);
    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }
    res.json(collaborator);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching collaborator' });
  }
};

export const createCollaborator = async (req: Request, res: Response) => {
  try {
    const collaborator = await Collaborator.create(req.body);
    res.status(201).json(collaborator);
  } catch (error) {
    res.status(400).json({ error: 'Error creating collaborator' });
  }
};

export const updateCollaborator = async (req: Request, res: Response) => {
  try {
    const collaborator = await Collaborator.findByPk(req.params.id);
    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }
    await collaborator.update(req.body);
    res.json(collaborator);
  } catch (error) {
    res.status(400).json({ error: 'Error updating collaborator' });
  }
};

export const deleteCollaborator = async (req: Request, res: Response) => {
  try {
    const collaborator = await Collaborator.findByPk(req.params.id);
    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }
    await collaborator.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting collaborator' });
  }
};
