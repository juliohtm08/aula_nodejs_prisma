import { Lead } from '@prisma/client';

// Define os possíveis status de um lead
export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Converted'
  | 'Unresponsive'
  | 'Disqualified'
  | 'Archived';

// Define os parâmetros que podem ser usados para filtrar buscas de leads
export interface LeadWhereParams {
  name?: {
    like?: string; // Busca por parte do nome
    equals?: string; // Busca exata
    mode?: 'default' | 'insensitive'; // Sensibilidade à caixa (case-sensitive/insensitive)
  };
  status?: LeadStatus; // Filtra pelo status do lead
}

// Define os parâmetros aceitos para listagem de leads, incluindo paginação e ordenação
export interface FindLeadParams {
  where?: LeadWhereParams; // Filtros
  sortBy?: 'name' | 'status' | 'createdAt'; // Campo de ordenação
  order?: 'asc' | 'desc'; // Ordem crescente ou decrescente
  limit?: number; // Quantidade de registros por página
  offset?: number; // Quantidade de registros a pular (para paginação)
}

// Define os atributos necessários para criar um lead
export interface CreateLeadAttributes {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

// Interface que define os métodos do repositório de leads
export interface LeadsRepository {
  find: (params: FindLeadParams) => Promise<Lead[]>; // Lista leads com filtros e paginação
  findById: (id: number) => Promise<Lead | null>; // Busca um lead por ID
  count: (where: LeadWhereParams) => Promise<number>; // Conta quantos leads existem com os filtros aplicados
  create: (attributes: CreateLeadAttributes) => Promise<Lead>; // Cria um novo lead
  updateById: (
    id: number,
    attributes: Partial<CreateLeadAttributes>
  ) => Promise<Lead | null>; // Atualiza um lead parcialmente
  DeleteById: (id: number) => Promise<Lead | null>; // Remove um lead pelo ID
}
