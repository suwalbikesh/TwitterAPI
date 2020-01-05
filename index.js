var express = require('express');
var routes = express();
var usersController = require('./controller/usersController');
var imageController = require('./controller/imageController');
var bodyParser = require('body-parser');


routes.use(bodyParser.urlencoded({extended:true}));
routes.post('/users/registration',usersController.validation,usersController.hashGen,usersController.registerUser,usersController.jwtTokenGen);

routes.post('/users/login',usersController.validator,usersController.passwordCheck,usersController.jwtTokenGen);

routes.post('/imageUpload',imageController.image,imageController.imageFileName);

routes.use('/*',function(req,res){
    res.status(404);
    res.send('NOT FOUND');
});

routes.use(function(err,req,res,next){
    res.json({
        status:err.status,
        message: err.message

    })
});

routes.listen(3012);
