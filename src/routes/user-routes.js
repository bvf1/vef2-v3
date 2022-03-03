import express from 'express';
import { validationResult } from 'express-validator';
import { catchErrors } from '../lib/catch-errors.js';
import { listUsers } from '../lib/db.js';
import { createUser, findById, findByUsername } from '../lib/users.js';
import { sanitizationMiddleware, userRegistrationValidationMiddleWare, xssSanitizationMiddleware} from '../lib/validation.js';

export const userRouter = express.Router();

async function users(req, res) {
  console.log('in users');
  const data = await listUsers();

  return res.json(data);
}

async function slugUser(req, res) {
  console.log('in slug user');
  const { slug } = req.params;
  const data = await findById(slug);
  return res.json(data);
}

async function register(req, res) {
  const { name = '', username = '', password = '' } = req.body;

  const data = await createUser(name, username, password);
  if (data) return res.status(201).send(
    `Notandi búinn til
     Nafn: ${name}
     Notendanafn: ${username}`);

  return res.status(404).json('Notandi ekki búinn til');
}

async function validationCheck(req, res, next) {
console.log('invalidationCheck');

  const {username} = req.body;

  console.log(username);
  const validation = validationResult(req);

  const customValidations = [];

  const usernameExists = await findByUsername(username);
  console.log(usernameExists);

  if (usernameExists !== null) {
    console.log('should it be here');
    customValidations.push({
      param: 'username',
      msg: 'Notendanafn er þegar til',
    })
  }

  if (!validation.isEmpty() || customValidations.length > 0) {
    return res.status(400).json(validation.errors.concat(customValidations))
  }
  return next();

}

userRouter.get('/', catchErrors(users));
userRouter.get('/:slug', catchErrors(slugUser));
// todo add requireAuthentication
userRouter.post(
  '/register',
  userRegistrationValidationMiddleWare(),
  xssSanitizationMiddleware(),
  // catchErrors(validationCheck),
  sanitizationMiddleware(),
  catchErrors(register)
);


