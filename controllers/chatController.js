const { chatService } = require("../services/chatService")

class chatController {

    importChat(request, response) {
        chatService.importChat(request.body.thisUserMail, request.body.otherUserMail, (error, data) => {
            if (error) return response.status(400).json({ err: JSON.stringify(error) })
            return response.json(data);
        });
    }

    newMessage(message, callback) {
        chatService.newMessage(message, (error, data) => {
            if (error) callback(error)
            return callback(data);
        });

    }
}

module.exports = {
    chatController: new chatController()
}