import { Handler } from 'express';
import { prisma } from '../database';
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from './schemas/LeadsRequestSchema';
import { HttpError } from '../errors/HttpError';
import { Prisma } from '@prisma/client';

export class LeadsController {
  // Método para listar leads com paginação, filtro e ordenação
  index: Handler = async (req, res, next) => {
    try {
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

      const where: Prisma.LeadWhereInput = {};

      // Filtra por nome, se fornecido
      if (name) where.name = { contains: name, mode: 'insensitive' };
      // Filtra por status, se fornecido
      if (status) where.status = status;

      // Busca os leads no banco de dados
      const leads = await prisma.lead.findMany({
        where,
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        orderBy: { [sortBy]: order },
      });

      // Conta o total de leads encontrados
      const total = await prisma.lead.count({ where: where });

      res.json({
        data: leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          total,
          totalPages: Math.ceil(total / pageSizeNumber),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Método para criar um novo lead
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const newLead = await prisma.lead.create({
        data: body,
      });
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  // Método para buscar um lead pelo ID
  show: Handler = async (req, res, next) => {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          groups: true, // Inclui os grupos relacionados ao lead
          campaigns: true, // Inclui as campanhas relacionadas ao lead
        },
      });

      if (!lead) throw new HttpError(404, 'Lead não encontrado!');

      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  // Método para atualizar um lead existente
  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const body = UpdateLeadRequestSchema.parse(req.body);

      // Verifica se o lead existe antes de atualizar
      const lead = await prisma.lead.findUnique({ where: { id } });
      if (!lead) throw new HttpError(404, 'Lead não encontrado');

      if (
        lead.status === 'New' &&
        body.status !== undefined &&
        body.status !== 'Contacted'
      ) {
        throw new HttpError(
          400,
          'Um novo lead deve ser contatado antes de ter seu status atualizado para outros valores!'
        );
      }

      if (body.status && body.status === 'Archived') {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 180) {
          throw new HttpError(
            400,
            'Um lead só pode ser arquivado após 6 meses de inatividade!'
          );
        }
      }

      const updatedLead = await prisma.lead.update({
        data: body,
        where: { id: id },
      });

      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  // Método para excluir um lead pelo ID
  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      // Verifica se o lead existe antes de excluir
      const leadExists = await prisma.lead.findUnique({ where: { id } });
      if (!leadExists) throw new HttpError(404, 'Lead não encontrado');

      const deletedUser = await prisma.lead.delete({
        where: { id: id },
      });

      res.json({ deletedUser });
    } catch (error) {
      next(error);
    }
  };
}
