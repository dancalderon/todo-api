import { mongoose } from "../server/db/mongoose";
import { Todo } from "../server/models/todo";
import { ObjectID } from "mongodb";
const id = "5c70d0279d2c7d2fa6";

//checks if the id has the correct format to be passed as an ObjectID

if (!ObjectID.isValid(id)) {
  console.log("ID not valid");
} else {
  //in this case, mongoose will transform the "id" to a ObjectID
  //find returns an array of results, findone returns the result
  Todo.find({
    _id: id
  })
    .then(result => {
      console.log("Todos", [...result]);
    })
    .catch(err => {
      console.log("ID not found");
    });
  Todo.findOne({
    _id: id
  })
    .then(result => {
      console.log("Todos", result);
    })
    .catch(err => {
      console.log("ID not found");
    });

  Todo.findById(id)
    .then(result => {
      console.log("by id", result);
    })
    .catch(err => {
      console.log("ID not found");
    });
}
