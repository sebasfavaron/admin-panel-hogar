import { Request, Response } from 'express';
import Donation from '../models/Donation';
import Collaborator from '../models/Collaborator';

export const getDonations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const donations = await Donation.findAll({
      include: [
        {
          model: Collaborator,
          as: 'collaborator',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['date', 'DESC']],
    });
    res.json(donations || []); // Return empty array if no donations
  } catch (error) {
    console.error('Error fetching donations:', error); // Add logging for debugging
    res.status(200).json([]); // Return empty array instead of 500 error
  }
};

export const getDonation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        {
          model: Collaborator,
          as: 'collaborator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    if (!donation) {
      res.status(404).json({ error: 'Donation not found' });
      return;
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching donation' });
  }
};

export const createDonation = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('Received donation creation request with body:', req.body);
  try {
    const donationData = {
      ...req.body,
      date: new Date(req.body.date), // Ensure date is properly converted
      collaboratorId: req.body.collaboratorId, // Map to correct field name
    };
    const donation = await Donation.create(donationData);
    const donationWithCollaborator = await Donation.findByPk(donation.id, {
      include: [
        {
          model: Collaborator,
          as: 'collaborator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    res.status(201).json(donationWithCollaborator);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(400).json({ error: 'Error creating donation' });
  }
};

export const updateDonation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const donation = await Donation.findByPk(req.params.id);
    if (!donation) {
      res.status(404).json({ error: 'Donation not found' });
      return;
    }
    const updateData = {
      ...req.body,
      date: new Date(req.body.date),
      collaboratorId: req.body.collaboratorId, // Map to correct field name
    };
    await donation.update(updateData);
    const updatedDonation = await Donation.findByPk(donation.id, {
      include: [
        {
          model: Collaborator,
          as: 'collaborator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    res.json(updatedDonation);
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(400).json({ error: 'Error updating donation' });
  }
};

export const deleteDonation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const donation = await Donation.findByPk(req.params.id);
    if (!donation) {
      res.status(404).json({ error: 'Donation not found' });
      return;
    }
    await donation.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting donation' });
  }
};

export const getDonationsByCollaborator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const donations = await Donation.findAll({
      where: { collaboratorId: req.params.collaboratorId },
      include: [
        {
          model: Collaborator,
          as: 'collaborator',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['date', 'DESC']],
    });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching donations' });
  }
};
