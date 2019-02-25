import expect from "expect";
import request from "supertest";
import { app } from "./../server";
import { Todo } from "./../models/todo";
import { User } from "./../models/user";
import { ObjectID } from "mongodb";

//runes somecode before every single test

//Creates a todos array of objects to be added
const todos = [
  {
    _id: new ObjectID(),
    text: "First test todo"
  },
  {
    _id: new ObjectID(),
    text: "second test todo"
  }
];
beforeEach(done => {
  Todo.remove({}) // removes all the todos
    .then(() => Todo.insertMany(todos)) //insert the todos objects
    .then(() => done());
});

//creates a describe "folder"
describe("POST /todos", () => {
  //test the async function - done
  it("Should create a new todo", done => {
    //test input
    const text = "Test text";
    //calls the app with supertest
    request(app)
      //calls the post method into "/todos"
      .post("/todos")
      //sends the request
      .send({ text })
      //assertions about the request
      //.expect = supertest / expect = expect
      //expects for the response
      .expect(200)
      .expect(res => expect(res.body.text).toBe(text))
      //.end allways creates an anfn with err and res as arguments
      //end with an anfn allows to check the response before been sent it
      .end((err, res) => {
        if (err) return done(err);
        //finds all the Todo's adn return a promise with them
        Todo.find({ text }) //we search specifically this object
          .then(result => {
            expect(result.length).toBe(1);
            expect(result[0].text).toBe(text);
            done();
          })
          .catch(err => done(err));
      });
  });

  it("Should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(result => {
            //we have 2 todos from the todos instert
            expect(result.length).toBe(2);
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });
});

describe("GET /todos", () => {
  it("Should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("Should return todo doc", done => {
    request(app)
      //toHexString will convert the ObjectID into a String
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        // here 'todo' is the object that we sent in the server
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it(`"Should return 404 if todo not found"`, done => {
    const hexID = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${"5c71e55b3ababe21d074ec9a"}`)
      .expect(404)
      .end(done);
  });
  it("Should return 404 for non-object ids", done => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});
describe("DELETE /todos/:id", () => {
  it("Should remove a todo", done => {
    const hexID = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect(res => expect(res.body.todo._id).toBe(hexID))
      //checks if not only we got a 200, but also the todo was removed
      .end((err, res) => {
        if (err) return done(err);
        Todo.findById(hexID)
          .then(result => {
            //expects the find results falsy, meaning the todo was removed
            expect(result).not.toBeTruthy();
            done();
          })
          .catch(err => done(err));
      });
  });
  it("Should return 404 if todo not found", done => {
    const hexID = new ObjectID();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });
  it("Should return 404 if Object ID is invalid", done => {
    request(app)
      .delete(`/todos/1125`)
      .expect(404)
      .end(done);
  });
});
