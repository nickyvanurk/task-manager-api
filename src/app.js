const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;