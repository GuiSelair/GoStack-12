import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import ProfileUserController from '@modules/user/infra/http/controllers/ProfileUserController';

const profileUserController = new ProfileUserController();
const usersRouter = Router();

usersRouter.use(ensureAuthenticated);

usersRouter.get('/', ensureAuthenticated, profileUserController.show);
usersRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
      old_password: Joi.string(),
    },
  }),
  ensureAuthenticated,
  profileUserController.update,
);

export default usersRouter;
