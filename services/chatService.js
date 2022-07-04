const mongoose = require('mongoose');

const { Schema } = mongoose;

const UsersSchema = new Schema({
    message: String,
    sender: String,
    reciever: String,
    date: Date,

});

//connect schema to DB in mongo
mongoose.model('chat', UsersSchema);
const Chat = mongoose.model('chat');

class chatService {

    newMessage(msg, callback) {
        const newMessage = new Chat(msg);
        newMessage.save()
            .then((msg) => {
                callback(null, msg);
            })
            .catch((err) => callback(err, null));
    }


    importChat(senderMail, recieverMail, callback) {
        Chat.find(
            {
                $or: [
                    { $and: [{ sender: senderMail }, { reciever: recieverMail }] },
                    { $and: [{ sender: recieverMail }, { reciever: senderMail }] }
                ]
            }
            , (error, data) => {
                callback(error, data);
            }
        )
    }
}

module.exports = {
    chatService: new chatService()
}