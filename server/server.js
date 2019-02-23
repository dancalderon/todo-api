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

app.get("/todos", (req, res) => {
  Todo.find()
    .then(todos => {
      //find will return an array, in order to add more keys and values
      //the best option is pass the result as an object with es6
      res.send({
        todos
        // code: "adding a new key and value"
      });
    })
    .catch(err => {
      res.send(err);
    });
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

export { app };
