var express = require('express');
var router = express.Router();
// const {indexController} = require('../controllers/loginController')
const passport = require('../middleware/passport')

// router.post("/login", checkUser, (request, response)=> loginController.login(request, response));
router.post('/login', passport.authenticate('local', { session: false, failureRedirect: '/err', }), (req, res, next) => {
    res.json(req.user);
});
router.get('/err', (req, res) => { res.status(401).send('Not autorized') });


module.exports = router;
