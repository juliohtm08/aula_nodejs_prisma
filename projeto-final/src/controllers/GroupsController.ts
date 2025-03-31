import { Handler } from 'express';
import { prisma } from '../database';
import {
  CreateGroupRequestSchema,
  UpdateGroupRequestSchema,
} from './schemas/GroupsRequestSchema';
import { HttpError } from '../errors/HttpError';

export class GroupsController {
  // listar groups
  index: Handler = async (req, res, next) => {
    try {
      const groups = await prisma.group.findMany();

      res.json({ groups });
    } catch (error) {
      next(error);
    }
  };

  // criar um novo group
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body);
      const newGroup = await prisma.group.create({ data: body });

      res.status(201).json({ newGroup });
    } catch (error) {
      next(error);
    }
  };

  // buscar um group pelo ID
  show: Handler = async (req, res, next) => {
    try {
      const group = await prisma.group.findUnique({
        where: { id: Number(req.params.id) },
        include: { leads: true },
      });

      if (!group) throw new HttpError(404, 'Group not found');

      res.json({ group });
    } catch (error) {
      next(error);
    }
  };

  // atualizar um group
  udpate: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateGroupRequestSchema.parse(req.body);

      const groupExists = await prisma.group.findUnique({
        where: { id: id },
      });

      if (!groupExists) throw new HttpError(404, 'group not found');

      const updatedGroup = await prisma.group.update({
        data: body,
        where: { id: id },
      });

      res.json({ updatedGroup });
    } catch (error) {
      next(error);
    }
  };

  // deletar um group
  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const groupExists = await prisma.group.findUnique({
        where: { id: id },
      });

      if (!groupExists) throw new HttpError(404, 'group not found');

      const deletedGroup = await prisma.group.delete({
        where: { id: id },
      });

      res.json({ deletedGroup });
    } catch (error) {
      next(error);
    }
  };
}
