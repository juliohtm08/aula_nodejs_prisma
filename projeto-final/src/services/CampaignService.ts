import { HttpError } from '../errors/HttpError';
import {
  CampaignsRepository,
  CreateCampaignAttributes,
} from '../repositories/CampaignsRepository';

export class CampaignsService {
  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  async getAllCampaigns() {
    const campaigns = await this.campaignsRepository.find();

    return campaigns;
  }

  async createCampaign(params: CreateCampaignAttributes) {
    const newCampaign = await this.campaignsRepository.create(params);

    return newCampaign;
  }

  async getCampaignById(id: number) {
    const campaign = await this.campaignsRepository.findById(id);
    if (!campaign) throw new HttpError(404, 'Campaign not found');

    return campaign;
  }

  async updateCampaign(id: number, params: CreateCampaignAttributes) {
    const campaign = await this.campaignsRepository.updateById(id, params);
    if (!campaign) throw new HttpError(404, 'Campaign not found');

    return campaign;
  }

  async deleteCampaign(id: number) {
    const deletedCampaign = await this.campaignsRepository.deleteById(id);
    if (!deletedCampaign) throw new HttpError(404, 'Campaign not found');

    return deletedCampaign;
  }
}
