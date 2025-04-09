import { Lead } from '@prisma/client';
import {
  CreateLeadAttributes,
  FindLeadParams,
  LeadsRepository,
  LeadWhereParams,
} from '../LeadsRepository';
import { prisma } from '../../database';

export class PrismaLeadsRepository implements LeadsRepository {
  // Busca múltiplos leads com filtros, ordenação e paginação
  async find(params: FindLeadParams): Promise<Lead[]> {
    return prisma.lead.findMany({
      where: {
        // Filtro por nome com opções de correspondência parcial, exata e sensibilidade
        name: {
          contains: params.where?.name?.like,
          equals: params.where?.name?.equals,
          mode: params.where?.name?.mode,
        },
        // Filtro por status do lead
        status: params.where?.status,
      },
      // Ordenação por campo (name, status, createdAt) e ordem (asc, desc)
      orderBy: { [params.sortBy ?? 'name']: params.order },
      // Paginação: pular resultados
      skip: params.offset,
      // Limite de resultados retornados
      take: params.limit,
    });
  }

  // Busca um único lead pelo ID, incluindo dados relacionados (grupos e campanhas)
  async findById(id: number): Promise<Lead | null> {
    return prisma.lead.findUnique({
      where: { id },
      include: {
        groups: true, // Inclui os grupos associados ao lead
        campaigns: true, // Inclui as campanhas associadas ao lead
      },
    });
  }

  // Conta quantos leads existem com base nos filtros fornecidos
  async count(where: LeadWhereParams): Promise<number> {
    return prisma.lead.count({
      where: {
        name: {
          contains: where?.name?.like,
          equals: where?.name?.equals,
          mode: where?.name?.mode,
        },
        status: where?.status,
      },
    });
  }

  // Cria um novo lead no banco de dados com os atributos fornecidos
  async create(attributes: CreateLeadAttributes): Promise<Lead> {
    return prisma.lead.create({ data: attributes });
  }

  // Atualiza parcialmente os dados de um lead identificado pelo ID
  async updateById(
    id: number,
    attributes: Partial<CreateLeadAttributes>
  ): Promise<Lead> {
    return prisma.lead.update({
      where: { id },
      data: attributes,
    });
  }

  // Deleta um lead do banco de dados com base no ID
  async DeleteById(id: number): Promise<Lead> {
    return prisma.lead.delete({ where: { id } });
  }
}
