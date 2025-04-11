import { Handler } from 'express';
import { AddLeadGroupRequestSchema } from './schemas/GroupsRequestSchema';
import { GetLeadsRequestSchema } from './schemas/LeadsRequestSchema';
import { GroupsLeadsService } from '../services/GroupLeadsService';
import { LeadCampaignStatus } from '../repositories/LeadsRepository';

export class GroupLeadsController {
  constructor(private readonly groupLeadsService: GroupsLeadsService) {}

  // retornar todos líderes de um grupo
  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId);
      const query = GetLeadsRequestSchema.parse(req.query);
      const { page = '1', pageSize = '10' } = query;

      const data = await this.groupLeadsService.getAllGroupLeads(groupId, {
        ...query,
        page: Number(page),
        pageSize: Number(pageSize),
      });

      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  // adicionar um líder a um grupo
  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId);
      const { leadId } = AddLeadGroupRequestSchema.parse(req.body);

      const updatedGroup = await this.groupLeadsService.addLead(
        groupId,
        leadId
      );

      res.status(201).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  // remover um líder de um grupo
  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId);
      const leadId = Number(req.params.leadId);

      const updatedGroup = await this.groupLeadsService.removeLead(
        groupId,
        leadId
      );

      res.status(200).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };
}
