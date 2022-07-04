var express = require('express');
var router = express.Router();
const {chatController} = require('../controllers/chatController');
const mid = require('../middleware/mid');

router.post("/chat", mid.checkToken, (request, response)=> chatController.importChat(request, response));

module.exports = router;
