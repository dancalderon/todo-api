import { mongoose } from "../server/db/mongoose";
import { Todo } from "../server/models/todo";
import { ObjectID } from "mongodb";
const id = "5c70d0279d2c7d2fa6";

if (!ObjectID.isValid(id)) {
  console.log("ID not valid");
} else {
  Todo.find({
    _id: id
  })
    .then(result => console.log("Todos", [...result]))
    .catch(err => console.log("ID not found"));
  Todo.findOne({
    _id: id
  })
    .then(result => console.log("Todos", result))
    .catch(err => console.log("ID not found"));

  Todo.findById(id)
    .then(result => console.log("by id", result))
    .catch(err => console.log("ID not found"));
}
