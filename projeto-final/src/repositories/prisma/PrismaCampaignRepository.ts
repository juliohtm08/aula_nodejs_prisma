import { Campaign } from '@prisma/client';
import {
  AddLeadCampaignAttributes,
  CampaignsRepository,
  CreateCampaignAttributes,
} from '../CampaignsRepository';
import { prisma } from '../../database';

export class PrismaCampaignRepository implements CampaignsRepository {
  // exibir todas as campanhas
  async find(): Promise<Campaign[]> {
    return prisma.campaign.findMany();
  }

  // filtrar um campanha pelo ID
  async findById(id: number): Promise<Campaign | null> {
    return prisma.campaign.findUnique({
      where: { id: id },
      include: {
        leads: {
          include: {
            lead: true,
          },
        },
      },
    });
  }

  // criar um campanha
  async create(attributes: CreateCampaignAttributes): Promise<Campaign> {
    return prisma.campaign.create({ data: attributes });
  }

  // atualizar uma campanha pelo ID
  async updateById(
    id: number,
    attributes: Partial<CreateCampaignAttributes>
  ): Promise<Campaign | null> {
    const campaignExists = await prisma.campaign.findUnique({
      where: { id: id },
    });
    if (!campaignExists) return null;

    return prisma.campaign.update({
      where: { id: id },
      data: attributes,
    });
  }

  // deletar uma campanha pelo ID
  async deleteById(id: number): Promise<Campaign | null> {
    const campaignExists = await prisma.campaign.findUnique({
      where: { id: id },
    });
    if (!campaignExists) return null;

    return prisma.campaign.delete({ where: { id: id } });
  }

  // adicionar um lead a uma campanha
  async addLead(attributes: AddLeadCampaignAttributes): Promise<void> {
    await prisma.leadCampaign.create({
      data: attributes,
    });
  }

  // atualizar o status de um lead
  async updateLeadStatus(attributes: AddLeadCampaignAttributes): Promise<void> {
    await prisma.leadCampaign.update({
      where: {
        leadId_campaignId: {
          leadId: attributes.leadId,
          campaignId: attributes.campaignId,
        },
      },
      data: { status: attributes.status },
    });
  }

  // remover um lead de uma campanha
  async removeLead(campaignId: number, leadId: number): Promise<void> {
    await prisma.leadCampaign.delete({
      where: {
        leadId_campaignId: {
          campaignId,
          leadId,
        },
      },
    });
  }
}
