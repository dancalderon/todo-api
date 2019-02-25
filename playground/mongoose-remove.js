import { mongoose } from "../server/db/mongoose";
import { Todo } from "../server/models/todo";
import { ObjectID } from "mongodb";

Todo.findByIdAndRemove("5c6f6e106575603754a138af")
  .then(todo => console.log(todo))
  .catch(err => console.log(err));

Todo.findOneAndRemove({ text: "postman" })
  .then(todo => console.log(todo))
  .catch(err => console.log(err));
