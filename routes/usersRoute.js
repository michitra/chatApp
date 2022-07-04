var express = require('express');
var router = express.Router();
const {usersController} = require('../controllers/usersController');
const mid = require('../middleware/mid');

router.get("/list", (request, response)=> usersController.usersList(request, response));
router.post("/find", mid.checkToken ,(request, response)=> usersController.findUser(request, response));
router.post("/new", (request, response)=> usersController.newUser(request, response));
router.post("/delete", mid.checkToken, mid.isAdmin, (request, response)=> usersController.deleteUser(request, response));
router.post("/update", mid.checkToken, mid.isAdmin, (request, response)=> usersController.updateUser(request, response));

module.exports = router;
