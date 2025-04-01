import { Handler } from 'express';
import { prisma } from '../database';
import {
  CreateCampaignRequestSchema,
  UpdateCampaignSchema,
} from './schemas/CampaignsRequestSchema';
import { HttpError } from '../errors/HttpError';

export class CampaignController {
  // listar campanhas
  index: Handler = async (req, res, next) => {
    try {
      const campaign = await prisma.campaign.findMany();

      res.json({ campaign });
    } catch (error) {
      next(error);
    }
  };

  // criar uma nova campanha
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);

      const newCampaign = await prisma.campaign.create({
        data: body,
      });

      res.status(201).json({ newCampaign });
    } catch (error) {
      next(error);
    }
  };

  // buscar uma campanha pelo ID
  show: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;

      const campaignExists = await prisma.campaign.findUnique({
        where: { id: id },
      });

      if (!campaignExists) throw new HttpError(404, 'Campaign not found');

      const campaign = await prisma.campaign.findUnique({
        where: { id: id },
        include: {
          leads: {
            include: {
              lead: true,
            },
          },
        },
      });

      res.json({ campaign });
    } catch (error) {
      next(error);
    }
  };

  // atualizar uma campanha
  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateCampaignSchema.parse(req.body);

      const campaignExists = await prisma.campaign.findUnique({
        where: { id: id },
      });

      if (!campaignExists) throw new HttpError(404, 'Campaign not found');

      const updatedCampaign = await prisma.campaign.update({
        data: body,
        where: {
          id: id,
        },
      });

      res.json({ updatedCampaign });
    } catch (error) {
      next(error);
    }
  };

  // deletar uma campanha
  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;

      const campaignExists = await prisma.campaign.findUnique({
        where: { id: id },
      });

      if (!campaignExists) throw new HttpError(404, 'Campaign not found');

      const deletedCampaign = await prisma.campaign.delete({
        where: { id: id },
      });

      res.json({ deletedCampaign });
    } catch (error) {
      next(error);
    }
  };
}
