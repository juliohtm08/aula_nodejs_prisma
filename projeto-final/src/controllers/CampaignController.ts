import { Handler } from 'express';
import {
  CreateCampaignRequestSchema,
  UpdateCampaignSchema,
} from './schemas/CampaignsRequestSchema';
import { CampaignsService } from '../services/CampaignService';

export class CampaignController {
  constructor(private readonly campaignsService: CampaignsService) {}

  // listar campanhas
  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsService.getAllCampaigns();

      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  // criar uma nova campanha
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);

      const newCampaign = await this.campaignsService.createCampaign(body);

      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };

  // buscar uma campanha pelo ID
  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const campaign = await this.campaignsService.getCampaignById(id);

      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  // atualizar uma campanha
  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const body = UpdateCampaignSchema.parse(req.body);

      const campaign = await this.campaignsService.updateCampaign(id, body);

      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  // deletar uma campanha
  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const deletedCampaign = await this.campaignsService.deleteCampaign(id);

      res.json(deletedCampaign);
    } catch (error) {
      next(error);
    }
  };
}
