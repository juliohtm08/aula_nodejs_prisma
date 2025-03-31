import { z } from 'zod';

// Define os possíveis status que um lead pode ter
const LeadStatusSchema = z.enum([
  'New', // Novo
  'Contacted', // Contatado
  'Qualified', // Qualificado
  'Converted', // Convertido
  'Unresponsive', // Sem resposta
  'Disqualified', // Desqualificado
  'Archived', // Arquivado
]);

// Esquema para obter leads com filtros opcionais e opções de ordenação
export const GetLeadsRequestSchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  name: z.string().optional(),
  status: LeadStatusSchema.optional(),
  sortBy: z.enum(['name', 'status', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

// Esquema para criar um novo lead
export const CreateLeadRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  status: LeadStatusSchema.optional(),
});

// Esquema para atualizar um lead existente
export const UpdateLeadRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: LeadStatusSchema.optional(),
});
