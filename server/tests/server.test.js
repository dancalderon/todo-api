import expect from 'expect';
import request from 'supertest';
import { ObjectID } from 'mongodb';
import { app } from '../server';
import { Todo } from '../models/todo';
import { User } from '../models/user';
import { todos, populateTodos, users, populateUsers } from './seed/seed';

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create a new todo', async () => {
    const text = 'this is a test';
    try {
      await request(app)
        .post('/todos')
        .send({ text })
        .expect(200)
        .expect(res => expect(res.body.text).toBe(text));
      const found = await Todo.find({ text });
      expect(found.length).toBe(1);
      expect(found[0].text).toBe(text);
    } catch (error) {
      throw error;
    }
  });

  it('Should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        Todo.find()
          .then(result => {
            expect(result.length).toBe(2);
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => expect(res.body.todos.length).toBe(2))
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => expect(res.body.todo.text).toBe(todos[0].text))
      .end(done);
  });
  it(`"Should return 404 if todo not found"`, done => {
    const hexID = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${'5c71e55b3ababe21d074ec9a'}`)
      .expect(404)
      .end(done);
  });
  it('Should return 404 for non-object ids', done => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});
describe('DELETE /todos/:id', () => {
  it('Should remove a todo', done => {
    const hexID = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect(res => expect(res.body.todo._id).toBe(hexID))
      .end((err, res) => {
        if (err) return done(err);
        Todo.findById(hexID)
          .then(result => {
            expect(result).not.toBeTruthy();
            done();
          })
          .catch(err => done(err));
      });
  });
  it('Should return 404 if todo not found', done => {
    const hexID = new ObjectID();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });
  it('Should return 404 if Object ID is invalid', done => {
    request(app)
      .delete(`/todos/1125`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo', done => {
    const hexId = todos[0]._id.toHexString();
    const text = 'kira is the best';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text, completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', done => {
    const hexId = todos[1]._id.toHexString();
    const text = 'Chromi rules';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });
});
