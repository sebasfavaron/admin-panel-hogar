import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const donationSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  payment_method: z.string().min(1, 'Payment method is required'),
  collaboratorId: z.string().uuid('Invalid collaborator ID'),
});

export const validateDonation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    donationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({ error: 'Invalid request body' });
    }
  }
};
