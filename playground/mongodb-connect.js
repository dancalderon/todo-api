import { MongoClient, ObjectID } from "mongodb";
//i --save and import

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  //.connect will take 2 arguments, the path to our localfile database, and an anfn
  //the database doesn't need to be created before we call it.
  //the anfn will take err and client as the arguments
  if (err) {
    return console.log("Unable to connecto to MongoDB server");
  }
  console.log("Connected to MongoDB server");
  const db = client.db("TodoApp");
  // Will create a database reference

  db.collection("Todos").insertOne(
    //.collection will create a new collection, and .insertone will add info to it
    {
      text: "Something to do",
      completed: false
    },
    (err, result) => {
      if (err) {
        return console.log("Unable to insert todo", err);
      }
      console.log(JSON.stringify(result.ops, undefined, 2));
    }
  );

  db.collection("User").insertOne(
    {
      name: "Chromi",
      age: 7,
      location: "puff"
    },
    (err, result) => {
      if (err) {
        console.log("Unable to insert todo", err);
      } else {
        console.log(JSON.stringify(result.ops[0], undefined, 2));
      }
    }
  );
  client.close();
});
