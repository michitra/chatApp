const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const { hash } = require('bcrypt');

const { Schema } = mongoose;

const UsersSchema = new Schema({
    name: String,
    lname: String,
    role: {
        type: String,
        default: 'user',
        enum: ['User', 'Admin']
    },
    phone: String,
    email: {
        type: String,
        required: 'Require e-mail',
        unique: 'Such e-mail exist'
    },
    password: String
});

//connect schema to DB in mongo
mongoose.model('Users', UsersSchema);
const Users = mongoose.model('Users');

class UserService {
    usersList(callback) {
        console.log('User List')
        Users.find({}, (error, data) => {
            callback(error, data);
        })
    }

    findUser(username, callback) {
        console.log('Find User', username)
        Users.find({ email: username }, (error, data) => {
            console.log('error: ', error, ', data: ', data)
            callback(error, data);
        })
    }

    newUser(user, callback) {
        console.log('New User', user);
        // user.password = bcrypt.hashSync(user.password, 10);
        user.password = this.cryptFunc(user.password)
        const finalUser = new Users(user);
        finalUser.save()
            .then((usr) => {
                console.log('data: ', usr);
                callback(null, usr);
            })
            .catch((err) => callback(err, null));
    }

    deleteUser(userEmail, callback) {
        console.log('deleting User', userEmail)
        Users.deleteOne({ email: userEmail.email })
            .then((usr) => {
                console.log('data: ', usr);
                callback(null, usr);
            })
            .catch((err) => callback(err, null))

    }

    updateUser(user, callback) {
        console.log('Updaiting User', user)
        user[0].password = this.cryptFunc(user[0].password)
        Users.findOneAndUpdate({ email: user[1] }, user[0], {
            returnNewDocument : true
        })
            .then((usr) => {
                console.log('data: ', usr);
                callback(null, usr);
            })
            .catch((err) => callback(err, null))
    }

    cryptFunc(password,callback){
        return bcrypt.hashSync(password, 10);
    }

}



module.exports = {
    userService: new UserService()
}