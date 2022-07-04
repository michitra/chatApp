const { userService } = require("../services/usersService")
let jwt = require('jsonwebtoken');
let config = require('./config');

// function checkUser (request, response, next) {
//     console.log("from mid: ",request.body);
//     userService.findUser(request.body.username,(error,data)=>{
//         console.log('Result :',data);
//         if (error) return response.status(400).json({err:JSON.stringify(error)})
//         else if (data.length==0) return response.status(401).json({ 'error': 'No such user' });
//         return next();
//     });
// }

function checkToken(request, response, next) {
    console.log('from checkToken')
    let token = request.headers['x-access-token'] || request.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return response.status(401).json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                console.log('Token decoded : ', decoded);
                //Add token payload to request
                request.decoded = decoded;
                next();
            }
        });
    } else {
        return response.status(401).json({ 'error': 'Auto token is not supplied' });
    }
}

function isAdmin(request, response, next) {
    console.log('from isAdmin')
    if (request.decoded.role == 'admin' || request.decoded.role =='Admin') {
        next();
    } else {
        return response.status(401).json({
            success: false,
            message: 'Permittion error'
        });
    }
}

module.exports = {
    // checkUser:checkUser,
    checkToken: checkToken,
    isAdmin: isAdmin
};