import { HttpError } from './errors/HttpError';
import { LeadsController } from './controllers/LeadsController';
import { GroupsController } from './controllers/GroupsController';
import { CampaignController } from './controllers/CampaignController';
import { CampaignLeadsController } from './controllers/CampaignLeadsController';
import { GroupLeadsController } from './controllers/GroupLeadsController';
import { PrismaLeadsRepository } from './repositories/prisma/PrismaLeadsRepository';
import { PrismaGroupsRepository } from './repositories/prisma/PrismaGroupsRepository';
import { PrismaCampaignRepository } from './repositories/prisma/PrismaCampaignRepository';

const leadsRepository = new PrismaLeadsRepository();
const groupsRepository = new PrismaGroupsRepository();
const campaignsRepository = new PrismaCampaignRepository();

export const leadsController = new LeadsController(leadsRepository);
export const groupsController = new GroupsController(groupsRepository);
export const groupLeadsController = new GroupLeadsController(
  groupsRepository,
  leadsRepository
);
export const campaignsController = new CampaignController(campaignsRepository);
export const campaignLeadsController = new CampaignLeadsController();
