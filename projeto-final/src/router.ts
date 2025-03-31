import { Router } from 'express';
import { HttpError } from './errors/HttpError';
import { LeadsController } from './controllers/LeadsController';
import { GroupsController } from './controllers/GroupsController';
import { CampaignController } from './controllers/CampaignController';

const router = Router();

const leadsController = new LeadsController();
const groupsController = new GroupsController();
const campaignsController = new CampaignController();

// rota para os leads
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

// rota de teste
router.get('/status', async (req, res, next) => {
  try {
    res.json({ message: 'ok' });
  } catch (error) {
    next(error);
  }
});

export { router };
