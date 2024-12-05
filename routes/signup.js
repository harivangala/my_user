const router = require('express').Router();
const signupController = require('../controllers/signupController');

router.post('/', signupController.signup);

module.exports = router;