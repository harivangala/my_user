const router = require('express').Router();
const signinController = require('../controllers/signinController');
const resetPasswordController = require('../controllers/resetPasswordController');

router.post('/', signinController.signin);
router.post('/change-password', resetPasswordController.changePassword);

module.exports = router;