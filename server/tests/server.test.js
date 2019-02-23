import expect from "expect";
import request from "supertest";
import { app } from "./../server";
import { Todo } from "./../models/todo";
import { User } from "./../models/user";
//runes somecode before every single test
beforeEach(done => {
  //this will remove all our todos
  //is an async functions, so we must use done to end the operation
  Todo.remove({}).then(() => done());
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
      .end((err, res) => {
        if (err) return done(err);
        //finds all the Todo's adn return a promise with them
        Todo.find()
          .then(result => {
            expect(result.length).toBe(1);
            expect(result[0].text).toBe(text);
            done();
          })
          .catch(err => done(err));
      });
  });

  it("Should note create todo with invalid body data", done => {
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
            expect(result.length).toBe(0);
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });
});
