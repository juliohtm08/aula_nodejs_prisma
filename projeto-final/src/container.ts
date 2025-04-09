import { HttpError } from './errors/HttpError';
import { LeadsController } from './controllers/LeadsController';
import { GroupsController } from './controllers/GroupsController';
import { CampaignController } from './controllers/CampaignController';
import { CampaignLeadsController } from './controllers/CampaignLeadsController';
import { GroupLeadsController } from './controllers/GroupLeadsController';
import { PrismaLeadsRepository } from './repositories/prisma/PrismaLeadsRepository';

const leadsRepository = new PrismaLeadsRepository();

export const leadsController = new LeadsController(leadsRepository);
export const groupsController = new GroupsController();
export const campaignsController = new CampaignController();
export const campaignLeadsController = new CampaignLeadsController();
export const groupLeadsController = new GroupLeadsController();
