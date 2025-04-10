import { Handler } from 'express';
import {
  CreateCampaignRequestSchema,
  UpdateCampaignSchema,
} from './schemas/CampaignsRequestSchema';
import { HttpError } from '../errors/HttpError';
import { CampaignsRepository } from '../repositories/CampaignsRepository';

export class CampaignController {
  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  // listar campanhas
  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsRepository.find();

      res.json({ campaigns });
    } catch (error) {
      next(error);
    }
  };

  // criar uma nova campanha
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);

      const newCampaign = await this.campaignsRepository.create(body);

      res.status(201).json({ newCampaign });
    } catch (error) {
      next(error);
    }
  };

  // buscar uma campanha pelo ID
  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const campaign = await this.campaignsRepository.findById(id);

      if (!campaign) throw new HttpError(404, 'Campaign not found');

      res.json({ campaign });
    } catch (error) {
      next(error);
    }
  };

  // atualizar uma campanha
  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const body = UpdateCampaignSchema.parse(req.body);

      const campaign = await this.campaignsRepository.updateById(id, body);

      if (!campaign) throw new HttpError(404, 'Campaign not found');

      res.json({ campaign });
    } catch (error) {
      next(error);
    }
  };

  // deletar uma campanha
  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const deletedCampaign = await this.campaignsRepository.deleteById(id);

      if (!deletedCampaign) throw new HttpError(404, 'Campaign not found');

      res.json({ deletedCampaign });
    } catch (error) {
      next(error);
    }
  };
}
