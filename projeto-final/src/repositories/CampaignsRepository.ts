import { Campaign, LeadCampaignStatus } from '@prisma/client';

export interface CreateCampaignAttributes {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface AddLeadCampaignAttributes {
  campaignId: number;
  leadId: number;
  status: LeadCampaignStatus;
}

export interface CampaignsRepository {
  find: () => Promise<Campaign[]>;
  findById: (id: number) => Promise<Campaign | null>;
  create: (attributes: CreateCampaignAttributes) => Promise<Campaign>;
  updateById: (
    id: number,
    attributes: Partial<CreateCampaignAttributes>
  ) => Promise<Campaign | null>;
  deleteById: (id: number) => Promise<Campaign | null>;
  addLead: (attributes: AddLeadCampaignAttributes) => Promise<void>;
  updateLeadStatus: (attributes: AddLeadCampaignAttributes) => Promise<void>;
  removeLead: (campaignId: number, leadId: number) => Promise<void>;
}
