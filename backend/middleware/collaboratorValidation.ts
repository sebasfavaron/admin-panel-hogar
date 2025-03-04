import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const collaboratorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  help_type: z.enum(['financial', 'physical', 'both']),
  last_contact: z.string().datetime().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
});

export const validateCollaborator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    collaboratorSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({ error: 'Invalid request body' });
    }
  }
};
