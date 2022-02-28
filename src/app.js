import express from 'express';
import passport from './lib/login.js';
import { isInvalid } from './lib/template-helpers.js';
import { userRouter } from './routes/user-routes.js';
import { eventRouter } from './routes/event-routes.js';

const app = express();

const data = [
  { id: 1, title: 'Foo', name: 'Jón' },
  { id: 2, title: 'Bar', name: 'Anna' },
];
app.get('/', (req, res) => {
  res.json(data);
});
/*
const {
  PORT = 3000
} = process.env;

// Sér um að req.body innihaldi gögn úr formi
app.use(express.json()); */

/*
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    maxAge: 20 * 1000, // 20 sek
  })
);
*/
// app.use(passport.initialize());
// app.use(passport.session());

app.locals = {
  isInvalid,
};

app.use('/users', userRouter);
app.use('/events', eventRouter);

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

app.listen(3000, () => {
  console.info('Server running at http://localhost:3000/');
});
