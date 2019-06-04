const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOneId, userOne, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Nicky',
      email: 'example@example.com',
      password: 'MyPass777!'
    })
    .expect(201);
  
  // Assert user is inserted in database correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Nicky',
      email: 'example@example.com'
    },
    token: user.tokens[0].token
  });

  // Assert password isn't stored as plaintext in database
  expect(user.password).not.toBe('MyPass777!');
});

test('Login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
  
  // Assert new token is saved to database
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'MyPass123!!'
    })
    .expect(400);
});

test('Get authenticated user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
});

test('Not get unauthenticated user profile', async () => {
  await request(app)
    .get('/users/me')
    .expect(401);
});

test('Delete authenticated user account', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  
  // Assert user is deleted from database
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Not delete unauthenticated user account', async () => {
  await request(app)
    .delete('/users/me')
    .expect(401);
});

test('Upload authenticated user avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);
  
  // Assert avatar got saved to database
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Update valid authenticated user fields', async () => {
  const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({name: 'William'})
    .expect(200);
  
  // Assert user field is updated
  const user = await User.findById(userOneId);
  expect(user.name).toBe('William');
});

test('Not update invalid authenticated user fields', async () => {
  const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({location: 'New York'})
    .expect(400);
});
