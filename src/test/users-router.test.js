import { test, describe, expect } from '@jest/globals';
import fetch from 'node-fetch';
import { catchErrors } from '../lib/catch-errors.js';
import { userRouter, index } from '../routes/user-routes.js';

describe('user-routes', () => {
  test('GET /users/', async () => {
    const result = await request(userRouter).get('/');
    expect(result.json).toBe('json');
  });
});
