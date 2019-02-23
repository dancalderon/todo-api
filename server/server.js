import express from "express";
import bodyParser from "body-parser";

import { mongoose } from "./db/mongoose";
import { Todo } from "./models/todo";
import { User } from "./models/user";

const app = express();
//use the bodyParser as a middleware
//middleware is a 'filter' or 'handler' between the req and the res
//in this case, we will format our res to JSON

app.use(bodyParser.json());

//This will send a JSON.object with some text on import PropTypes from 'prop-types'
//the server will take this object, extract the text, create a new model
//and will return a new complete model to the client

app.post("/todos", (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo
    .save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

export { app };
