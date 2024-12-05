const router = require('express').Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

router.post('/', forgotPasswordController.forgotPassword);
router.post('/token-verify/:token', forgotPasswordController.tokenVerify);

module.exports = router;