import { HttpError } from '../errors/HttpError';
import {
  CreateLeadAttributes,
  LeadsRepository,
  LeadStatus,
  LeadWhereParams,
} from '../repositories/LeadsRepository';

export interface GetLeadsWithPaginationParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: LeadStatus;
  sortBy?: 'name' | 'status' | 'createdAt';
  order?: 'asc' | 'desc';
}
export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository) {}

  async getAllLeadsPaginated(params: GetLeadsWithPaginationParams) {
    const { name, status, page = 1, pageSize = 10, sortBy, order } = params;

    // Converte parâmetros de paginação em números
    const limit = pageSize;
    const offset = (page - 1) * limit;

    // Monta o objeto de filtro
    const where: LeadWhereParams = {};

    if (name) where.name = { like: name, mode: 'insensitive' };
    if (status) where.status = status;

    // Busca os leads e total correspondente
    const leads = await this.leadsRepository.find({
      where,
      sortBy,
      order,
      limit,
      offset,
    });
    const total = await this.leadsRepository.count(where);

    return {
      leads,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / page),
      },
    };
  }

  async createLead(params: CreateLeadAttributes) {
    if (!params.status) params.status = 'New';
    const newLead = await this.leadsRepository.create(params);
    return newLead;
  }

  async getLeadById(id: number) {
    const lead = await this.leadsRepository.findById(id);
    if (!lead) throw new HttpError(404, 'Lead não encontrado!');

    return lead;
  }

  async updateLead(leadId: number, params: Partial<CreateLeadAttributes>) {
    const lead = await this.leadsRepository.findById(leadId);
    if (!lead) throw new HttpError(404, 'Lead não encontrado');

    if (
      lead.status === 'New' &&
      params.status !== undefined &&
      params.status !== 'Contacted'
    ) {
      throw new HttpError(
        400,
        'Um novo lead deve ser contatado antes de ter seu status atualizado para outros valores!'
      );
    }

    if (params.status && params.status === 'Archived') {
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

    const updatedLead = await this.leadsRepository.updateById(leadId, params);

    return updatedLead;
  }

  async deleteLead(leadId: number) {
    const leadExists = await this.leadsRepository.findById(leadId);
    if (!leadExists) throw new HttpError(404, 'Lead não encontrado');

    const deletedUser = await this.leadsRepository.DeleteById(leadId);
    return deletedUser;
  }
}
