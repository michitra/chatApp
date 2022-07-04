const { userService } = require("../services/usersService")

class UsersController {

    usersList (request, response) {
        console.log('User Controller List');
        userService.usersList((error,data)=>{
            if (error) return response.status(400).json({err:JSON.stringify(error)})
            return response.json(data);
        });
    }

    findUser(request, response) {
        console.log('User Controller find');
        userService.findUser(request.body.user,(error,data)=>{
            if (error) return response.status(400).json({err:JSON.stringify(error)})
            return response.json(data);
        });
    }

    newUser(request, response) {
        console.log('User Controller new: ', request.body);
        userService.newUser(request.body,(error,data)=>{
            if (error) return response.status(400).json({err:JSON.stringify(error)})
            return response.json(data);
        });
        
    }

    deleteUser(request, response) {
        console.log('User Controller delete: ', request.body);
        userService.deleteUser(request.body,(error,data)=>{
            if (error) return response.status(400).json({err:JSON.stringify(error)})
            return response.json(data);
        });
        
    }

    updateUser(request, response) {
        console.log('User Controller update: ', request.body);
        userService.updateUser(request.body,(error,data)=>{
            if (error) return response.status(400).json({err:JSON.stringify(error)})
            return response.json(data);
        });  
    }

}


module.exports = {
    usersController: new UsersController()
}