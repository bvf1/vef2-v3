import express from 'express';
import { validationResult } from 'express-validator';
import { catchErrors } from '../lib/catch-errors.js';
import {
  createEvent,
  deleteEvent,
  deleteRegistrations,
  listEvent,
  listEventById,
  listEventByName,
  listEvents,
  registrationsByEventANDUser,
  register,
  updateEvent,
} from '../lib/db.js';
import { requireAuthentication } from '../lib/login.js';

import { slugify } from '../lib/slugify.js';
import {
  registrationValidationMiddleware,
  sanitizationMiddleware,
  textFieldValidationMiddleware,
  xssSanitizationMiddleware,
} from '../lib/validation.js';

export const eventRouter = express.Router();

async function eventsRoute(req, res) {
  const data = await listEvents();

  return res.json(data);
}

// post /events/
async function registerEventRoute(req, res) {
  const { name = '', description = '' } = req.body;
  const slug = slugify(name);
  const user = req.user.id;
  const data = await createEvent({ name, slug, description, user });

  if (data) {
    return res.status(201).send(data);
  }
  return res.status(404).json('Atburður ekki búinn til');
}

async function validationCheck(req, res, next) {
  const { name } = req.body;

  const validation = validationResult(req);

  const customValidations = [];

  const nameExists = await listEventByName(name);

  if (nameExists !== null) {
    customValidations.push({
      param: 'name',
      msg: 'Atburður er þegar til',
    });
  }

  const slugExists = await listEvent(slugify(name));

  if (slugExists !== null && customValidations.length === 0) {
    customValidations.push({
      param: 'name',
      msg: 'linkur er frátekinn, þarf að breyta nafni á viðburði',
    });
  }

  if (!validation.isEmpty() || customValidations.length > 0) {
    return res.status(400).json(validation.errors.concat(customValidations));
  }
  return next();
}

// post events/:slug
async function eventRoute(req, res) {
  const { slug } = req.params;
  const data = await listEventById(slug);

  if (data) return res.json(data);

  return res.status(404).send('Atburður er ekki til');
}

async function patchEvent(req, res) {
  // admin or user who made
  let { name, description } = req.body;

  const id = req.params.slug;

  let slug = slugify(name);

  let data = await listEventById(id);

  if (name === '' || name === undefined) {
    name = data.name;
    slug = data.slug;
  }

  if (data.name === name && data.description === description) {
    return res.send('Engin breyting var gerð');
  }

  if (description === undefined) description = data.description;
  const obj = { name, slug, description };

  data = await updateEvent(id, obj);

  return res.json(data);
}

async function patchValidationCheck(req, res, next) {
  const { slug } = req.params;
  const event = await listEventById(slug);

  if (!event) return res.status(400).send('Atburður er ekki til');

  if (!(event.id === req.user.id || req.user.admin === true)) {
    return res.send(
      'Þú þarft að vera skráður fyrir viðburðinum eða vera stjórnandi'
    );
  }

  const validation = validationResult(req);
  const customValidations = [];

  // er skráður
  const nameExists = await listEventByName(req.body.name);

  if (nameExists !== null && nameExists.id.toString() !== slug) {
    customValidations.push({
      param: 'name',
      msg: 'Nafn er þegar til',
    });
  }

  // check if slug
  const slugExists = await listEvent(slugify(req.body.name));
  if (
    slugExists &&
    slugExists.id.toString() !== slug &&
    customValidations.length === 0
  ) {
    customValidations.push({
      param: 'name',
      msg: 'linkur er frátekinn, þarf að breyta nafni á viðburði',
    });
  }

  if (!validation.isEmpty() || customValidations.length > 0) {
    return res.status(400).json(validation.errors.concat(customValidations));
  }
  return next();
}

async function deleteEventRoute(req, res) {
  const { slug } = req.params;

  const event = await listEventById(slug);

  if (!event) return res.status(400).send('Atburður er ekki til');

  if (!(event.id === req.user.id || req.user.admin === true)) {
    return res.send(
      'Þú þarft að vera skráður fyrir viðburðinum eða vera stjórnandi'
    );
  }

  await deleteRegistrations(slug);
  await deleteEvent(slug);

  const eventExists = await listEventById(slug);
  if (!eventExists) return res.send('Atburður var eyddur');

  return res.send('Atburður var ekki eyddur');
}

async function registerForEventRoute(req, res) {
  const event = req.params.slug;
  const user = req.user.id;

  const { comment = '' } = req.body;
  let data = await registrationsByEventANDUser(event, user);
  if (data.length > 0) {
    return res.send('Þú ert þegar skráður á viðburðin');
  }
  await register({ user, comment, event });

  data = await registrationsByEventANDUser(event, user);

  return res.json(data);
}

async function registerValidationCheck(req, res, next) {
  const validation = validationResult(req);

  if (!validation.isEmpty()) return res.status(400).json(validation.errors);
  return next();
}

async function deleteRegistrationRoute(req, res) {
  const event = req.params.slug;
  const user = req.user.id;
  const eventExists = await listEventById(event);
  if (!eventExists) return res.status(400).send('Atburður er ekki til');

  const data = await registrationsByEventANDUser(event, user);

  if (data.length === 0) return res.status(400).send('Skráning var ekki til');

  await deleteRegistrations(event, user);
  const isRegistered = await registrationsByEventANDUser(event, user);
  if (isRegistered.length === 0)
    return res.json('Þú ert ekki lengur skráður á viðburðinn');
  return res.send('Tókst ekki að afskrá');
}

eventRouter.get('/', catchErrors(eventsRoute));
eventRouter.post(
  '/',
  requireAuthentication,
  registrationValidationMiddleware('description'),
  xssSanitizationMiddleware('description'),
  catchErrors(validationCheck),
  sanitizationMiddleware('description'),
  catchErrors(registerEventRoute)
);
eventRouter.get('/:slug', catchErrors(eventRoute));

eventRouter.patch(
  '/:slug',
  requireAuthentication,
  textFieldValidationMiddleware('description'),
  xssSanitizationMiddleware('description'),
  catchErrors(patchValidationCheck),
  sanitizationMiddleware('description'),
  catchErrors(patchEvent)
);

eventRouter.delete(
  '/:slug',
  requireAuthentication,
  catchErrors(deleteEventRoute)
);

eventRouter.post(
  '/:slug/register',
  requireAuthentication,
  textFieldValidationMiddleware('comment'),
  xssSanitizationMiddleware('comment'),
  catchErrors(registerValidationCheck),
  sanitizationMiddleware('comment'),
  catchErrors(registerForEventRoute)
);

eventRouter.delete(
  '/:slug/register',
  requireAuthentication,
  catchErrors(deleteRegistrationRoute)
);
// todo add requireAuthentication
