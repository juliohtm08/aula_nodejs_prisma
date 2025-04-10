import { Campaign } from '@prisma/client';
import {
  CampaignsRepository,
  CreateCampaignAttributes,
} from '../CampaignsRepository';
import { prisma } from '../../database';

export class PrismaCampaignRepository implements CampaignsRepository {
  async find(): Promise<Campaign[]> {
    return prisma.campaign.findMany();
  }
  async findById(id: number): Promise<Campaign | null> {
    return prisma.campaign.findUnique({ where: { id: id } });
  }
  async create(attirbutes: CreateCampaignAttributes): Promise<Campaign> {
    return prisma.campaign.create({ data: attirbutes });
  }
  async updateById(
    id: number,
    attirbutes: Partial<CreateCampaignAttributes>
  ): Promise<Campaign | null> {
    return prisma.campaign.update({
      where: { id: id },
      data: attirbutes,
    });
  }
  async deleteById(id: number): Promise<Campaign | null> {
    return prisma.campaign.delete({ where: { id: id } });
  }
}
