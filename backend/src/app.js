require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const incidentsRoutes = require('./routes/incidents.routes');
const usersRoutes = require('./routes/users.routes');
const { notFoundHandler, centralizedErrorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

app.use(healthRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(incidentsRoutes);
app.use(usersRoutes);

app.use(notFoundHandler);
app.use(centralizedErrorHandler);

module.exports = app;
