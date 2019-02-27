import express from 'express';
import bodyParser from 'body-parser';

import { ObjectID } from 'mongodb';
import _ from 'lodash';
import { mongoose } from './db/mongoose';
import { Todo } from './models/todo';
import { User } from './models/user';
import { authenticate } from './middleware/authenticate';

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
// POST /todos
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo
    .save()
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
});

// GET /todos
app.get('/todos', (req, res) => {
  Todo.find()
    .then(todos => res.send({ todos }))
    .catch(err => res.send(err));
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id)
    .then(todo => (!todo ? res.status(404).send() : res.send({ todo })))
    .catch(err => res.status(400).send(`404 not found`));
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) return res.status(404).send();

  Todo.findByIdAndRemove(id)
    .then(todo =>
      !todo ? res.status(404).send() : res.status(200).send({ todo })
    )
    .catch(err => res.status(400).send(`404 not found`));
});

// PATCH /todos:id
app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) return res.status(404).send();
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) return res.status(404).send();
      res.send({ todo });
    })
    .catch(err => res.status(400).send());
});

// POST /users
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User({
    email: body.email,
    password: body.password,
  });

  user
    .save()
    .then(() => user.generateAuthToken())
    .then(token => res.header('x-auth', token).send(user))
    .catch(err => res.status(400).send(err));
});

// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', async (req, res) => {
  // this is the vanilla es6 alternative to _.pick
  const { email, password } = req.body;
  // const body = _.pick(req.body, ['email', 'password']);
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (error) {
    res.status(400).send();
  }
});

// CONNECT TO THE PORT
app.listen(port, () => console.log(`Started up at port ${port}!`));

export { app };
