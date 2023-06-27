const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/', userController.getAllUsers);
router.get('/:username', userController.getSingleUser);
router.post('/', userController.createUser);
router.put('/:username', userController.updateUser);
router.delete('/:username', userController.deleteUser);

module.exports = router;