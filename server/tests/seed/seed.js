import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';

import { Todo } from '../../models/todo';
import { User } from '../../models/user';

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id: userOneId,
    email: 'chromi@example.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userOneId, access: 'auth' }, 'abc123')
          .toString(),
      },
    ],
  },
  {
    _id: userTwoId,
    email: 'kira@example.com',
    password: 'userTwoPass',
  },
];
const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
  },
  {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 1125,
  },
];

const populateTodos = async () => {
  await Todo.remove({});
  await Todo.insertMany(todos);
};

const populateUsers = async () => {
  await User.remove({});
  const userOne = new User(users[0]).save();
  const userTwo = new User(users[1]).save();
  await Promise.all([userOne, userTwo]);
};

export { todos, populateTodos, users, populateUsers };
