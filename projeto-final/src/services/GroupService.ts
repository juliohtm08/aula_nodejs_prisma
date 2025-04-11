import { HttpError } from '../errors/HttpError';
import {
  CreateGroupsAttributes,
  GroupsRepository,
} from '../repositories/GroupsRepository';

export class GroupService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async getAllGroups() {
    const groups = await this.groupsRepository.find();

    return groups;
  }

  async createGroup(params: CreateGroupsAttributes) {
    const newGroup = await this.groupsRepository.create(params);

    return newGroup;
  }

  async getGroupById(id: number) {
    const group = await this.groupsRepository.findById(id);
    if (!group) throw new HttpError(404, 'Group not found');

    return group;
  }

  async updateGroup(id: number, params: CreateGroupsAttributes) {
    const updatedGroup = await this.groupsRepository.updateById(id, params);
    if (!updatedGroup) throw new HttpError(404, 'group not found');

    return updatedGroup;
  }

  async deleteGroup(id: number) {
    const deletedGroup = await this.groupsRepository.deleteById(id);
    if (!deletedGroup) throw new HttpError(404, 'group not found');

    return deletedGroup;
  }
}
