import express from 'express';
import { validationResult } from 'express-validator';
import { catchErrors } from '../lib/catch-errors.js';
import { listUsers } from '../lib/db.js';
import { requireAuthentication } from '../lib/login.js';
import { createUser, findById, findByUsername } from '../lib/users.js';
import {
  regUserSanitizationMiddleware,
  userRegistrationValidationMiddleWare,
  xssRegUserSanitizationMiddleware,
} from '../lib/validation.js';

export const userRouter = express.Router();

async function usersRoute(req, res) {
  if (req.user.admin === false) return res.send('Notandi er ekki stjórnandi');

  const data = await listUsers();

  return res.json(data);
}

async function userRoute(req, res) {
  const { slug } = req.params;
  const data = await findById(slug);
  if (data) {
    if (req.user.admin === false) return res.send('Notandi er ekki stjórnandi');
    return res.json(data);
  }
  return res.status(404).send('Notandi er ekki til');
}

async function register(req, res) {
  const { name = '', username = '', password = '' } = req.body;

  const data = await createUser(name, username, password);
  if (data)
    return res.status(201).send(
      `Notandi búinn til
     Nafn: ${name}
     Notendanafn: ${username}`
    );

  return res.status(404).json('Notandi ekki búinn til');
}

async function validationCheck(req, res, next) {
  const { username } = req.body;

  const validation = validationResult(req);

  const customValidations = [];

  const usernameExists = await findByUsername(username);

  if (usernameExists !== null) {
    customValidations.push({
      param: 'username',
      msg: 'Notendanafn er þegar til',
    });
  }

  if (!validation.isEmpty() || customValidations.length > 0) {
    return res.status(400).json(validation.errors.concat(customValidations));
  }
  return next();
}

function meRoute(req, res) {
  const { username, name } = req.user;
  return res.json({ username, name });
}

userRouter.get('/', requireAuthentication, catchErrors(usersRoute));
userRouter.get('/me', requireAuthentication, meRoute);
userRouter.get('/:slug', requireAuthentication, catchErrors(userRoute));
userRouter.post(
  '/register',
  userRegistrationValidationMiddleWare(),
  xssRegUserSanitizationMiddleware(),
  catchErrors(validationCheck),
  regUserSanitizationMiddleware(),
  catchErrors(register)
);
