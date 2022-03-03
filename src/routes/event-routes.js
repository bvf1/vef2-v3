import express from 'express';
import { catchErrors } from '../lib/catch-errors.js';

export const eventRouter = express.Router();

const data = [
  { id: 1, title: 'Foo', name: 'Jón' },
  { id: 2, title: 'Bar', name: 'Anna' },
];

async function index(req, res) {
  res.json(data);
}

eventRouter.get('/', catchErrors(index));
// todo add requireAuthentication
