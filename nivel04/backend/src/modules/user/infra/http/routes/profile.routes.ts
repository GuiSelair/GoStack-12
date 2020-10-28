import { Router } from 'express';

import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import ProfileUserController from '@modules/user/infra/http/controllers/ProfileUserController';

const profileUserController = new ProfileUserController();
const usersRouter = Router();

usersRouter.use(ensureAuthenticated);

usersRouter.get('/', ensureAuthenticated, profileUserController.show);
usersRouter.put('/', ensureAuthenticated, profileUserController.update);

export default usersRouter;
