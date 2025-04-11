import { LeadCampaignStatus } from '@prisma/client';
import { CampaignsRepository } from '../repositories/CampaignsRepository';
import {
  LeadsRepository,
  LeadWhereParams,
} from '../repositories/LeadsRepository';
import { GetLeadsWithPaginationParams } from './LeadsService';

export interface GetCampaignLeadsWithParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: LeadCampaignStatus;
  sortBy?: 'name' | 'status' | 'createdAt';
  order?: 'asc' | 'desc';
}

export class CampaignLeadsService {
  constructor(
    private readonly campaignsRepository: CampaignsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}

  async getAllCampaignLeads(
    campaignId: number,
    params: GetCampaignLeadsWithParams
  ) {
    const { name, status, page = 1, pageSize = 10, sortBy, order } = params;

    const limit = pageSize;
    const offset = (page - 1) * limit;

    const where: LeadWhereParams = {
      campaignId,
      campaignStatus: status,
    };

    if (name) where.name = { like: name, mode: 'insensitive' };

    const leads = await this.leadsRepository.find({
      where,
      sortBy,
      order,
      limit: limit,
      offset: offset,
      include: { campaigns: true },
    });

    const total = await this.leadsRepository.count(where);

    return {
      leads,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addLead(
    campaignId: number,
    leadId: number,
    status: LeadCampaignStatus
  ) {
    const lead = await this.campaignsRepository.addLead({
      campaignId,
      leadId,
      status,
    });

    return lead;
  }

  async updateLeadStatus(
    campaignId: number,
    leadId: number,
    status: LeadCampaignStatus
  ) {
    return await this.campaignsRepository.updateLeadStatus({
      campaignId,
      leadId,
      status,
    });
  }

  async removeLead(campaignId: number, leadId: number) {
    return await this.campaignsRepository.removeLead(campaignId, leadId);
  }
}
