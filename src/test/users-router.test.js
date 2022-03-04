import { test, describe, expect } from '@jest/globals';
import fetch from 'node-fetch';

import dotenv from 'dotenv';

dotenv.config();

describe('user-routes', () => {
  test('GET /users/', async () => {
    const { status } = await fetch('http://localhost:3000/users/');
    expect(status).toBe(200);
  });
  test('GET /users/:id, user exists', async () => {
    const { status } = await fetch('http://localhost:3000/users/1');
    expect(status).toBe(200);
  });
  test('GET /users/:id, user does not exist', async () => {
    const response = await fetch('http://localhost:3000/users/100');
    // const data = await response.text();
    expect(response.status).toBe(404);
  });

  test('POST /users/register', async () => {
    const body = {
      name: 'Guðrún Guðrúnar',
      username: 'gunna',
      password: '123',
    };

    const response = await fetch('http://localhost:3000/users/register', {
      method: 'POST',
      body,
    });

    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toBe('Notandi ekki búinn til');
  });

  test('POST /users/login', async () => {
    const body = {
      username: 'gunna',
      password: '123',
    };

    const response = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      body,
    });

    const token = await response.token;

    expect(response.status).toBe(200);
    expect(token).toBeTruthy();
  });
});
