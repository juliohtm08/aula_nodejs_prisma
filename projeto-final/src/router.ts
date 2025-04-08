import { Router } from 'express';
import { HttpError } from './errors/HttpError';
import { LeadsController } from './controllers/LeadsController';
import { GroupsController } from './controllers/GroupsController';
import { CampaignController } from './controllers/CampaignController';
import { CampaignLeadsController } from './controllers/CampaignLeadsController';
import { GroupLeadsController } from './controllers/GroupLeadsController';

const router = Router();

const leadsController = new LeadsController();
const groupsController = new GroupsController();
const campaignsController = new CampaignController();
const campaignLeadsController = new CampaignLeadsController();
const groupLeadsController = new GroupLeadsController();

// rota para os líderes
router.get('/leads', leadsController.index);
router.post('/leads', leadsController.create);
router.get('/leads/:id', leadsController.show);
router.put('/leads/:id', leadsController.update);
router.delete('/leads/:id', leadsController.delete);

// rota para os groups
router.get('/groups', groupsController.index);
router.post('/groups', groupsController.create);
router.get('/groups/:id', groupsController.show);
router.put('/groups/:id', groupsController.udpate);
router.delete('/groups/:id', groupsController.delete);

// rota para as campanhas
router.get('/campaigns', campaignsController.index);
router.post('/campaigns', campaignsController.create);
router.get('/campaigns/:id', campaignsController.show);
router.put('/campaigns/:id', campaignsController.update);
router.delete('/campaigns/:id', campaignsController.delete);

// rota para os líderes da campanha
router.get('/campaign/:campaignId/leads', campaignLeadsController.getLeads);
router.post('/campaign/:campaignId/leads', campaignLeadsController.addLead);
router.put(
  '/campaign/:campaignId/leads/:leadId',
  campaignLeadsController.updateLeadStatus
);
router.delete(
  '/campaign/:campaignId/leads/:leadId',
  campaignLeadsController.removeLead
);

// rota para os líderes dos grupos
router.get('/group/:groupId/leads', groupLeadsController.getLeads);
router.post('/group/:groupId/leads', groupLeadsController.addLead);
router.delete('/group/:groupId/leads/:leadId', groupLeadsController.removeLead);

// rota de teste
router.get('/status', async (req, res, next) => {
  try {
    res.json({ message: 'ok' });
  } catch (error) {
    next(error);
  }
});

export { router };
