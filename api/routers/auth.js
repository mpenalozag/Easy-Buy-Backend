const express = require('express');
const router = express.Router();
const authMiddlewares = require('../middlewares/auth');
const authControllers = require('../controllers/auth');

router.post('/register', authMiddlewares.checkDuplicates);
router.post('/register', authControllers.register);


router.post('/login', );

module.exports = router;