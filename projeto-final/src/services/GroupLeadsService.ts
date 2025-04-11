import { GroupsRepository } from '../repositories/GroupsRepository';
import {
  LeadsRepository,
  LeadWhereParams,
} from '../repositories/LeadsRepository';
import { GetLeadsWithPaginationParams } from './LeadsService';

export class GroupsLeadsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}

  async getAllGroupLeads(
    groupId: number,
    params: GetLeadsWithPaginationParams
  ) {
    const { name, status, page = 1, pageSize = 10, sortBy, order } = params;

    const limit = pageSize;
    const offset = (page - 1) * limit;

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

  async addLead(groupId: number, leadId: number) {
    const updatedGroup = await this.groupsRepository.addLead(groupId, leadId);

    return updatedGroup;
  }

  async removeLead(groupId: number, leadId: number) {
    const updatedGroup = await this.groupsRepository.removeLead(
      groupId,
      leadId
    );

    return updatedGroup;
  }
}
