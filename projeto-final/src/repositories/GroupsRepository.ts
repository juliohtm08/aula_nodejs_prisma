import { Group } from '@prisma/client';

export interface CreateGroupsAttributes {
  name: string;
  description: string;
}

export interface GroupsRepository {
  find: () => Promise<Group[]>;
  findById: (id: number) => Promise<Group | null>;
  create: (attributes: CreateGroupsAttributes) => Promise<Group>;
  updateById: (
    id: number,
    attributes: Partial<CreateGroupsAttributes>
  ) => Promise<Group | null>;
  deleteById: (id: number) => Promise<Group | null>;
  addLead: (groupId: number, leadId: number) => Promise<Group>;
  removeLead: (groupId: number, leadId: number) => Promise<Group>;
}
