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
import { CampaignsService } from './services/CampaignService';

// repositories
const leadsRepository = new PrismaLeadsRepository();
const groupsRepository = new PrismaGroupsRepository();
const campaignsRepository = new PrismaCampaignRepository();

// services
export const leadsService = new LeadsService(leadsRepository);
export const groupsService = new GroupService(groupsRepository);
export const campaignsService = new CampaignsService(campaignsRepository);

// controllers
export const leadsController = new LeadsController(leadsService);
export const groupsController = new GroupsController(groupsService);
export const groupLeadsController = new GroupLeadsController(
  groupsRepository,
  leadsRepository
);
export const campaignsController = new CampaignController(campaignsService);
export const campaignLeadsController = new CampaignLeadsController(
  campaignsRepository,
  leadsRepository
);
