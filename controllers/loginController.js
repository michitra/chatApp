const bcrypt = require('bcrypt');
const { userService } = require("../services/usersService")

class IndexController {
    login(request, response) {
        console.log("Login body", request.body)
        userService.findUser(request.body.username, (error, data) => {
            console.log('Password :', data[0].password);
            if (error) return response.status(400).json({ err: JSON.stringify(error) })
            else if (data.length == 0) {
                return response.status(401).json({ 'error': 'No such user' });
            }
            else if (!bcrypt.compareSync(request.body.password, data[0].password)) {
                return response.status(403).json({ 'error': 'wrong password' });
            } else {
                return response.json({ result: 1 });
            }
        });
    }

}

module.exports = {
    loginController: new loginController()
}