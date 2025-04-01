import { z } from 'zod';

// esquema para criar uma nova campanha
export const CreateCampaignRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});

// esquema para atualizar uma campanha
export const UpdateCampaignSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
