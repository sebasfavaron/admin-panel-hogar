import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const emailCampaignSchema = z.object({
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject cannot exceed 200 characters'),
  body: z
    .string()
    .min(1, 'Body is required')
    .max(50000, 'Body cannot exceed 50,000 characters'),
  status: z
    .enum(['draft', 'sent'], {
      errorMap: () => ({ message: 'Status must be draft or sent' }),
    })
    .optional(),
});

const filterSchema = z
  .object({
    helpType: z
      .enum(['financial', 'physical', 'both'], {
        errorMap: () => ({
          message: 'Invalid help type. Must be financial, physical, or both',
        }),
      })
      .optional(),
    lastContactBefore: z
      .string()
      .datetime({
        message:
          'Invalid date format for lastContactBefore. Use ISO date string',
      })
      .optional(),
    lastContactAfter: z
      .string()
      .datetime({
        message:
          'Invalid date format for lastContactAfter. Use ISO date string',
      })
      .optional(),
  })
  .optional();

const sendSchema = z
  .object({
    filters: filterSchema,
  })
  .superRefine((data, ctx) => {
    if (data.filters?.lastContactBefore && data.filters?.lastContactAfter) {
      const before = new Date(data.filters.lastContactBefore);
      const after = new Date(data.filters.lastContactAfter);
      if (before <= after) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'lastContactBefore must be later than lastContactAfter',
          path: ['filters'],
        });
      }
    }
  });

export const validateEmailCampaign = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    emailCampaignSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    } else {
      res.status(400).json({ error: 'Invalid request body' });
    }
  }
};

export const validateSend = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    sendSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    } else {
      res.status(400).json({ error: 'Invalid request body' });
    }
  }
};
