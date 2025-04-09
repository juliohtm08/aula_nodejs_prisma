import { Handler } from 'express';
import { AddLeadGroupRequestSchema } from './schemas/GroupsRequestSchema';
import { GetLeadsRequestSchema } from './schemas/LeadsRequestSchema';
import { GroupsRepository } from '../repositories/GroupsRepository';
import {
  LeadsRepository,
  LeadWhereParams,
} from '../repositories/LeadsRepository';

export class GroupLeadsController {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}

  // retornar todos líderes de um grupo
  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId);
      const query = GetLeadsRequestSchema.parse(req.query);
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

      const where: LeadWhereParams = { groupId };

      if (name) where.name = { like: name, mode: 'insensitive' };
      if (status) where.status = status;

      const leads = await this.leadsRepository.find({
        where,
        sortBy,
        order,
        limit: limit,
        offset: offset,
        include: { groups: true },
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

  // adicionar um líder a um grupo
  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId);
      const { leadId } = AddLeadGroupRequestSchema.parse(req.body);

      const updatedGroup = await this.groupsRepository.addLead(groupId, leadId);

      res.status(201).json({ updatedGroup });
    } catch (error) {
      next(error);
    }
  };

  // remover um líder de um grupo
  removeLead: Handler = async (req, res, next) => {
    try {
      const leadId = Number(req.params.leadId);
      const groupId = Number(req.params.groupId);

      const updatedGroup = await this.groupsRepository.removeLead(
        groupId,
        leadId
      );

      res.status(200).json({ updatedGroup });
    } catch (error) {
      next(error);
    }
  };
}
