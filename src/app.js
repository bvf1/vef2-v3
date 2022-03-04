import express from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import { isInvalid } from './lib/template-helpers.js';

import { userRouter } from './routes/user-routes.js';
import { eventRouter } from './routes/event-routes.js';
import passport from './lib/login.js';
import { strat } from './lib/login.js';
import { comparePasswords, findByUsername } from './lib/users.js';

const {
  PORT: port = 3000,
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 20000,
  DATABASE_URL: databaseUrl,
} = process.env;

const app = express();

// Sér um að req.body innihaldi gögn úr formi
app.use(express.json());

if (!jwtSecret || !databaseUrl) {
  console.error('Vantar .env gildi');
  process.exit(1);
}

export const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(new Strategy(jwtOptions, strat));

app.use(passport.initialize());

app.use('/users', userRouter);
app.use('/events', eventRouter);

userRouter.post('/login', async (req, res) => {
  const { username, password = '' } = req.body;

  const user = await findByUsername(username);

  if (!user) {
    return res.status(401).json({ error: 'No such user' });
  }

  const passwordIsCorrect = await comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifetime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid password' });
});

/** Middleware sem sér um 404 villur. */
app.use((req, res) => {
  console.warn('Not found', req.originalUrl);
  res.status(404).json({ error: 'Not found' });
});

/** Middleware sem sér um villumeðhöndlun. */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Grípum illa formað JSON og sendum 400 villu til notanda
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
