import { mongoose } from "../server/db/mongoose";
import { Todo } from "../server/models/todo";
import { ObjectID } from "mongodb";

//removes all the todos, we need to pass an object as value123456789012345
// Todo.remove({})
//   .then(result => console.log(result))
//   .catch(err => console.log(err));

//this will remove the item if it's found, and return the item removed
Todo.findByIdAndRemove("5c6f6e106575603754a138af")
  .then(todo => console.log(todo))
  .catch(err => console.log(err));
//finds by query
Todo.findOneAndRemove({ text: "postman" })
  .then(todo => console.log(todo))
  .catch(err => console.log(err));
