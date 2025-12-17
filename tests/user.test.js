const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const userRoutes = require('../routes/user'); // router that defines /register and /login
const User = require('../models/User');

let mongod;
let app;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Connect mongoose to in-memory mongo
  await mongoose.connect(uri);

  // Create express app and mount user routes
  app = express();
  app.use(express.json());
  // Mount routes at /api/users to match how real server would use them
  app.use('/api/users', userRoutes);
});

afterAll(async () => {
  // Disconnect mongoose and stop in-memory mongo
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
});

afterEach(async () => {
  // Clean up users collection between tests
  await User.deleteMany({});
});

test('Register user -> should return 201 and created user (without password)', async () => {
  const res = await request(app)
    .post('/api/users/register')
    .send({ username: 'testuser', password: 'Password123' })
    .set('Accept', 'application/json');

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('message', 'User registered successfully');
  expect(res.body).toHaveProperty('user');
  expect(res.body.user).toHaveProperty('id');
  expect(res.body.user).toHaveProperty('username', 'testuser');

  // Ensure password not returned
  expect(res.body.user).not.toHaveProperty('password');

  // Ensure user persisted in DB
  const usersInDb = await User.find().lean();
  expect(usersInDb.length).toBe(1);
  expect(usersInDb[0].username).toBe('testuser');
  expect(usersInDb[0].password).toBeDefined(); // hashed password exists in DB
});

test('Login with correct credentials -> should return 200 and user info', async () => {
  // First register
  await request(app)
    .post('/api/users/register')
    .send({ username: 'testuser', password: 'Password123' })
    .set('Accept', 'application/json');

  // Then login
  const res = await request(app)
    .post('/api/users/login')
    .send({ username: 'testuser', password: 'Password123' })
    .set('Accept', 'application/json');

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('message', 'Login successful');
  expect(res.body).toHaveProperty('user');
  expect(res.body.user).toHaveProperty('username', 'testuser');
  expect(res.body.user).not.toHaveProperty('password');
});

test('Login with wrong password -> should return 401', async () => {
  // Register user
  await request(app)
    .post('/api/users/register')
    .send({ username: 'testuser', password: 'Password123' })
    .set('Accept', 'application/json');

  // Attempt login with wrong password
  const res = await request(app)
    .post('/api/users/login')
    .send({ username: 'testuser', password: 'WrongPass' })
    .set('Accept', 'application/json');

  expect(res.status).toBe(401);
  expect(res.body).toHaveProperty('message', 'Invalid credentials');
});

test('GET /api/users -> should return users without password field', async () => {
  // Register user
  await request(app)
    .post('/api/users/register')
    .send({ username: 'testuser', password: 'Password123' })
    .set('Accept', 'application/json');

  const res = await request(app)
    .get('/api/users')
    .set('Accept', 'application/json');

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBe(1);
  expect(res.body[0]).toHaveProperty('username', 'testuser');
  expect(res.body[0]).not.toHaveProperty('password');
});
