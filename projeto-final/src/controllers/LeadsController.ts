import { Handler } from 'express';
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from './schemas/LeadsRequestSchema';
import { LeadsService } from '../services/LeadsService';

export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // Método para listar leads com paginação, filtros (nome e status) e ordenação
  index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query);
      const { page = '1', pageSize = '10' } = query;

      const result = await this.leadsService.getAllLeadsPaginated({
        ...query,
        page: Number(page),
        pageSize: Number(pageSize),
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // Método para criar um novo lead
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);

      const newLead = await this.leadsService.createLead(body);
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  // Método para buscar detalhes de um lead pelo ID
  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const lead = await this.leadsService.getLeadById(id);
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

      const updatedLead = await this.leadsService.updateLead(id, body);
      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  // Método para deletar um lead pelo ID
  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const deletedUser = await this.leadsService.deleteLead(id);
      res.json({ deletedUser });
    } catch (error) {
      next(error);
    }
  };
}
