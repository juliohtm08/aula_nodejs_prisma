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
import { CampaignLeadsService } from '../services/CampaignLeadsService';

export class CampaignLeadsController {
  constructor(private readonly campaignLeadsService: CampaignLeadsService) {}

  // exibir todos o leads de uma campanha
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);
      const query = GetCampaignLeadsRequestSchema.parse(req.query);
      const { page = '1', pageSize = '10' } = query;

      const data = await this.campaignLeadsService.getAllCampaignLeads(
        campaignId,
        {
          ...query,
          page: Number(page),
          pageSize: Number(pageSize),
        }
      );

      res.json(data);
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

      await this.campaignLeadsService.addLead(campaignId, leadId, status);

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

      await this.campaignLeadsService.updateLeadStatus(
        campaignId,
        leadId,
        status
      );

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

      await this.campaignLeadsService.removeLead(campaignId, leadId);

      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}
