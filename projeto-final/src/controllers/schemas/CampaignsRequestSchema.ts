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

const LeadCampaignStatusSchema = z.enum([
  'New',
  'Engaged',
  'FollowUp_Scheduled',
  'Contacted',
  'Qualified',
  'Converted',
  'Unresponsive',
  'Disqualified',
  'Re_Engaged',
  'Opted_Out',
]);

export const GetCampaignLeadsRequestSchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  name: z.string().optional(),
  status: LeadCampaignStatusSchema.optional(),
  sortBy: z.enum(['name', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const AddLeadCampaignRequestSchema = z.object({
  leadId: z.number(),
  status: LeadCampaignStatusSchema.optional(),
});

export const UpdateLeadStatusRequestSchema = z.object({
  status: LeadCampaignStatusSchema,
});
