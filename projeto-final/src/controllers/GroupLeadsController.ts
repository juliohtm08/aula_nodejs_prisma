import { Prisma } from '@prisma/client';
import { Handler } from 'express';
import { AddLeadGroupRequestSchema } from './schemas/GroupsRequestSchema';
import { prisma } from '../database';
import { HttpError } from '../errors/HttpError';
import { GetLeadsRequestSchema } from './schemas/LeadsRequestSchema';

export class GroupLeadsController {
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

      const pageNumber = Number(page);
      const pageSizeNumber = Number(pageSize);

      const where: Prisma.LeadWhereInput = {
        groups: {
          some: { id: groupId },
        },
      };

      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (status) where.status = status;

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        include: {
          groups: true,
        },
      });

      const total = await prisma.lead.count({ where });

      res.json({
        leads,
        meta: {
          page: pageNumber,
          pageSize: pageSize,
          total,
          totalPages: Math.ceil(total / pageSizeNumber),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId);
      const { leadId } = AddLeadGroupRequestSchema.parse(req.body);

      const existingEntry = await prisma.lead.findFirst({
        where: {
          id: leadId,
          groups: {
            some: {
              id: groupId,
            },
          },
        },
      });

      if (existingEntry) throw new HttpError(400, 'Lead já vinculado');

      const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data: {
          leads: {
            connect: { id: leadId },
          },
        },
        include: {
          leads: true,
        },
      });

      res.status(201).json({ updatedGroup });
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const leadId = Number(req.params.leadId);
      const groupId = Number(req.params.groupId);

      const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data: {
          leads: {
            disconnect: { id: leadId },
          },
        },
        include: {
          leads: true,
        },
      });

      res.status(200).json({ updatedGroup });
    } catch (error) {
      next(error);
    }
  };
}
