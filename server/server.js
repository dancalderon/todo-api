const env = process.env.NODE_ENV || "development";

import express from "express";
import bodyParser from "body-parser";

import { mongoose } from "./db/mongoose";
import { Todo } from "./models/todo";
import { User } from "./models/user";
import { ObjectID } from "mongodb";
import _ from "lodash";

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo
    .save()
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
});

app.get("/todos", (req, res) => {
  Todo.find()
    .then(todos => res.send({ todos }))
    .catch(err => res.send(err));
});
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id)
    .then(todo => (!todo ? res.status(404).send() : res.send({ todo })))
    .catch(err => res.status(400).send(`404 not found`));
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) return res.status(404).send();

  Todo.findByIdAndRemove(id)
    .then(todo =>
      !todo ? res.status(404).send() : res.status(200).send({ todo })
    )
    .catch(err => res.status(400).send(`404 not found`));
});

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["text", "completed"]);

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

app.get("/users", (req, res) => {
  User.find()
    .then(users => res.send({ users }))
    .catch(err => res.send(err));
});

app.post("/users", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  const user = new User({
    email: body.email,
    password: body.password
  });

  user
    .save()
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
});

app.listen(port, () => console.log(`Started up at port ${port}!`));

export { app, env };
