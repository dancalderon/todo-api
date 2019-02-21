import { MongoClient, ObjectID } from "mongodb";

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connecto to MongoDB server");
  }
  console.log("Connected to MongoDB server");
  const db = client.db("TodoApp");
  // db.collection("Todos")
  //   .find({ _id: new ObjectID("5c6ee483f39cdd0820afb74e") })
  //    //finds the item with the id passed
  //   .toArray() //returns a promise
  //   .then(result => {
  //     console.log(JSON.stringify(result, undefined, 2));
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  // db.collection("Todos")
  //   .find()
  //   .count()
  //   //returns a promise with the size/length of the Todos collection
  //   .then(result => {
  //     console.log(result);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  db.collection("User")
    .find({ name: "Kamina" })
    .toArray()
    .then(result => {
      console.log(JSON.stringify(result, undefined, 2));
    })
    .catch(err => {
      console.log(err);
    });

  client.close();
});
