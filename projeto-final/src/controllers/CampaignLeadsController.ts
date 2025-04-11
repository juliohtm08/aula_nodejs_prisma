import { Handler } from 'express';
import {
  AddLeadCampaignRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from './schemas/CampaignsRequestSchema';

import { CampaignsRepository } from '../repositories/CampaignsRepository';
import {
  LeadsRepository,
  LeadWhereParams,
} from '../repositories/LeadsRepository';

export class CampaignLeadsController {
  constructor(
    private readonly campaignsRepository: CampaignsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}

  // exibir todos o leads de uma campanha
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);
      const query = GetCampaignLeadsRequestSchema.parse(req.query);
      const {
        page = '1',
        pageSize = '10',
        name,
        status,
        sortBy = 'name',
        order = 'asc',
      } = query;

      const limit = Number(pageSize);
      const offset = (Number(page) - 1) * limit;

      const where: LeadWhereParams = { campaignId, campaignStatus: status };

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

      res.json({
        leads,
        meta: {
          page: Number(page),
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  //adicionar um lead a uma campanha
  addLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);
      const { leadId, status = 'New' } = AddLeadCampaignRequestSchema.parse(
        req.body
      );

      await this.campaignsRepository.addLead({ campaignId, leadId, status });
      res.status(201).end();
    } catch (error) {
      next(error);
    }
  };

  // atulizar o status de um lead
  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);
      const leadId = Number(req.params.leadId);
      const { status } = UpdateLeadStatusRequestSchema.parse(req.body);

      await this.campaignsRepository.updateLeadStatus({
        campaignId,
        leadId,
        status,
      });
      res.json({ message: `Status of the successfully updated lead` });
    } catch (error) {
      next(error);
    }
  };

  // remover um lead de uma campanha
  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);
      const leadId = Number(req.params.leadId);

      await this.campaignsRepository.removeLead(campaignId, leadId);

      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}
