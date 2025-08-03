const express = require('express');
const router = express.Router();

const Admin = require('../controllers/admin');

router.post('/signup',Admin.signup);
router.post('/login', Admin.login);