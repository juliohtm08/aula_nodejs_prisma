import { Handler } from 'express';
import {
  CreateGroupRequestSchema,
  UpdateGroupRequestSchema,
} from './schemas/GroupsRequestSchema';
import { GroupService } from '../services/GroupService';

export class GroupsController {
  constructor(private readonly groupsService: GroupService) {}

  // listar groups
  index: Handler = async (req, res, next) => {
    try {
      const groups = await this.groupsService.getAllGroups();

      res.json(groups);
    } catch (error) {
      next(error);
    }
  };

  // criar um novo group
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body);

      const newGroup = await this.groupsService.createGroup(body);
      res.status(201).json({ newGroup });
    } catch (error) {
      next(error);
    }
  };

  // buscar um group pelo ID
  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const group = await this.groupsService.getGroupById(id);
      res.json({ group });
    } catch (error) {
      next(error);
    }
  };

  // atualizar um group
  udpate: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const body = UpdateGroupRequestSchema.parse(req.body);

      const updatedGroup = await this.groupsService.updateGroup(id, body);

      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  // deletar um group
  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const deletedGroup = await this.groupsService.deleteGroup(id);

      res.json(deletedGroup);
    } catch (error) {
      next(error);
    }
  };
}
