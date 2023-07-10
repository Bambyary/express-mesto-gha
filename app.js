const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { NOT_FOUND } = require('./models/error');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('База данных подключена'))
  .catch(() => console.log('База данных не подключена'));

app.use((req, _res, next) => {
  req.user = {
    _id: '64a9a21a8d09f3fe01fe510c',
  };

  next();
});

app.use(bodyParser.json());
app.use('/', userRoutes);
app.use('/', cardRoutes);
app.use('*', (_req, res) => res.status(NOT_FOUND).json({ message: 'Страница не найдена' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
