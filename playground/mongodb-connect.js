import { MongoClient, ObjectID } from "mongodb";

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) return console.log("Unable to connecto to MongoDB server");

  console.log("Connected to MongoDB server");
  const db = client.db("TodoApp");

  db.collection("Todos").insertOne(
    {
      text: "Something to do",
      completed: false
    },
    (err, result) => {
      if (err) return console.log("Unable to insert todo", err);
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
      err
        ? console.log("Unable to insert todo", err)
        : console.log(JSON.stringify(result.ops[0], undefined, 2));
    }
  );
  client.close();
});
