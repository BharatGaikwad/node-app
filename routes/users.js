var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');


router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/get/:id', userController.getUserById);
router.get('/list', userController.getList);
router.put('/update', userController.updateUser);
router.delete('/delete/:id', userController.removeUserById)

module.exports = router;