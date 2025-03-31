import { z } from 'zod';

// esquema para criar um novo group
export const CreateGroupRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
});

// esquema para atualizar um group
export const UpdateGroupRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
