import express from "express";
import bodyParser from "body-parser";

import { mongoose } from "./db/mongoose";
import { Todo } from "./models/todo";
import { User } from "./models/user";
import { ObjectID } from "mongodb";

const app = express();
const port = process.env.PORT || 3000;
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

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then(todo =>
      !todo ? res.status(404).send() : res.status(200).send({ todo })
    )
    .catch(err => res.status(400).send(`404 not found`));
});

app.listen(port, () => {
  console.log(`Started up at port ${port}!`);
});

export { app };
