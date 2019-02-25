import express from "express";
import bodyParser from "body-parser";

import { mongoose } from "./db/mongoose";
import { Todo } from "./models/todo";
import { User } from "./models/user";
import { ObjectID } from "mongodb";
import _ from "lodash";

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

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  //pick will take an object and will take the properties that we passed, if they exist
  //this returns an object
  const body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  //type of 'boolean' and completed = true
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  //fins the item by id, declares what update will be make it and options
  //$set will take the body object, and set the todo values as the body values
  // in this case todo.completed = body.complited, and todo.text = body.text
  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) return res.status(404).send();
      res.send({ todo });
    })
    .catch(err => res.status(400).send());
});

app.listen(port, () => {
  console.log(`Started up at port ${port}!`);
});

export { app };
