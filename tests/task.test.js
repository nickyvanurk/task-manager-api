const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {userOne, userTwo, taskOne, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Create task for authenticated user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({description: 'From my test'})
    .expect(201)

  // Assert task is inserted in database correctly
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test('Get tasks for authenticated user', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

  // Assert getting all tasks for authenticated user
  expect(response.body).toHaveLength(2);
});

test('Not delete unauthorized user task', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404)

  // Assert if task is still in database
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});