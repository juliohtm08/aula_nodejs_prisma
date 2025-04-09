import { Group } from '@prisma/client';
import { CreateGroupsAttributes, GroupsRepository } from '../GroupsRepository';
import { prisma } from '../../database';

export class PrismaGroupsRepository implements GroupsRepository {
  async find(): Promise<Group[]> {
    return prisma.group.findMany();
  }
  async findById(id: number): Promise<Group | null> {
    return prisma.group.findUnique({ where: { id: id } });
  }
  async create(attributes: CreateGroupsAttributes): Promise<Group> {
    return prisma.group.create({ data: attributes });
  }
  async updateById(
    id: number,
    attributes: Partial<CreateGroupsAttributes>
  ): Promise<Group | null> {
    return prisma.group.update({
      where: { id: id },
      data: attributes,
    });
  }
  async deleteById(id: number): Promise<Group | null> {
    return prisma.group.delete({ where: { id: id } });
  }
}
