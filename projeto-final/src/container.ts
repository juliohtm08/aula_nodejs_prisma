import { LeadsController } from './controllers/LeadsController';
import { GroupsController } from './controllers/GroupsController';
import { CampaignController } from './controllers/CampaignController';
import { CampaignLeadsController } from './controllers/CampaignLeadsController';
import { GroupLeadsController } from './controllers/GroupLeadsController';
import { PrismaLeadsRepository } from './repositories/prisma/PrismaLeadsRepository';
import { PrismaGroupsRepository } from './repositories/prisma/PrismaGroupsRepository';
import { PrismaCampaignRepository } from './repositories/prisma/PrismaCampaignRepository';
import { LeadsService } from './services/LeadsService';
import { GroupService } from './services/GroupService';

const leadsRepository = new PrismaLeadsRepository();
const groupsRepository = new PrismaGroupsRepository();
const campaignsRepository = new PrismaCampaignRepository();

export const leadsService = new LeadsService(leadsRepository);
export const groupsService = new GroupService(groupsRepository);

export const leadsController = new LeadsController(leadsService);
export const groupsController = new GroupsController(groupsService);
export const groupLeadsController = new GroupLeadsController(
  groupsRepository,
  leadsRepository
);
export const campaignsController = new CampaignController(campaignsRepository);
export const campaignLeadsController = new CampaignLeadsController(
  campaignsRepository,
  leadsRepository
);
