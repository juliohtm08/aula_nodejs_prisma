import { Handler } from 'express';
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from './schemas/LeadsRequestSchema';
import { HttpError } from '../errors/HttpError';
import {
  LeadsRepository,
  LeadWhereParams,
} from '../repositories/LeadsRepository';

export class LeadsController {
  private leadsRepository: LeadsRepository;

  constructor(leadsRepository: LeadsRepository) {
    // Injeta a dependência do repositório de leads
    this.leadsRepository = leadsRepository;
  }

  // Método para listar leads com paginação, filtros (nome e status) e ordenação
  index: Handler = async (req, res, next) => {
    try {
      // Valida e extrai parâmetros da query string
      const query = GetLeadsRequestSchema.parse(req.query);
      const {
        page = '1',
        pageSize = '10',
        name,
        status,
        sortBy = 'name',
        order = 'asc',
      } = query;

      // Converte parâmetros de paginação em números
      const limit = Number(pageSize);
      const offset = (Number(page) - 1) * limit;

      // Monta o objeto de filtro
      const where: LeadWhereParams = {};
      if (name) where.name = { like: name, mode: 'insensitive' };
      if (status) where.status = status;

      // Busca os leads e total correspondente
      const leads = await this.leadsRepository.find({
        where,
        sortBy,
        order,
        limit: limit,
        offset: offset,
      });

      const total = await this.leadsRepository.count(where);

      // Retorna os dados e metadados de paginação
      res.json({
        data: leads,
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

  // Método para criar um novo lead
  create: Handler = async (req, res, next) => {
    try {
      // Valida o corpo da requisição com o schema de criação
      const body = CreateLeadRequestSchema.parse(req.body);

      // Cria o lead no repositório
      const newLead = await this.leadsRepository.create(body);

      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  // Método para buscar detalhes de um lead pelo ID
  show: Handler = async (req, res, next) => {
    try {
      const lead = await this.leadsRepository.findById(Number(req.params.id));

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

      // Valida o corpo da requisição com o schema de atualização
      const body = UpdateLeadRequestSchema.parse(req.body);

      // Verifica se o lead existe antes de atualizar
      const lead = await this.leadsRepository.findById(id);
      if (!lead) throw new HttpError(404, 'Lead não encontrado');

      // Regra de negócio: lead novo só pode ser atualizado para "Contacted" inicialmente
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

      // Regra de negócio: só pode arquivar após 6 meses de inatividade
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

      // Atualiza o lead com os novos dados
      const updatedLead = await this.leadsRepository.updateById(id, body);

      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  // Método para deletar um lead pelo ID
  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      // Verifica se o lead existe antes de excluir
      const leadExists = await this.leadsRepository.findById(id);
      if (!leadExists) throw new HttpError(404, 'Lead não encontrado');

      // Exclui o lead e retorna o dado excluído
      const deletedUser = await this.leadsRepository.DeleteById(id);

      res.json({ deletedUser });
    } catch (error) {
      next(error);
    }
  };
}
