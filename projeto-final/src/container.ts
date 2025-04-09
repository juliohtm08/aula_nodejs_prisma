import { HttpError } from './errors/HttpError';
import { LeadsController } from './controllers/LeadsController';
import { GroupsController } from './controllers/GroupsController';
import { CampaignController } from './controllers/CampaignController';
import { CampaignLeadsController } from './controllers/CampaignLeadsController';
import { GroupLeadsController } from './controllers/GroupLeadsController';
import { PrismaLeadsRepository } from './repositories/prisma/PrismaLeadsRepository';
import { PrismaGroupsRepository } from './repositories/prisma/PrismaGroupsRepository';

const leadsRepository = new PrismaLeadsRepository();
const groupsRepository = new PrismaGroupsRepository();

export const leadsController = new LeadsController(leadsRepository);
export const groupsController = new GroupsController(groupsRepository);
export const campaignsController = new CampaignController();
export const campaignLeadsController = new CampaignLeadsController();
export const groupLeadsController = new GroupLeadsController();
