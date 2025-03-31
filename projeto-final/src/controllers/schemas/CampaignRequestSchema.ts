import { z } from 'zod';

// esquema para criar uma nova campanha
export const CreateCampaignRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.string().transform((date) => new Date(date)),
  endDate: z.string().transform((date) => new Date(date)),
});

// esquema para atualizar uma campanha
export const UpdateCampaignSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z
    .string()
    .transform((date) => new Date(date))
    .optional(),
  endDate: z
    .string()
    .transform((date) => new Date(date))
    .optional(),
});
