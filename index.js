var express = require('express');
var routes = express();
var usersController = require('./controller/usersController');
var imageController = require('./controller/imageController');
var postController = require('./controller/postController');
var bodyParser = require('body-parser');


routes.use(bodyParser.urlencoded({extended: true}));
routes.use(express.json());
routes.use(express.static(__dirname + "/public"));
routes.post('/v1/users/registration',usersController.validation,usersController.hashGen,usersController.registerUser,usersController.jwtTokenGen);

routes.post('/v1/users/login',usersController.validator,usersController.passwordCheck,usersController.jwtTokenGen);

routes.post('/v1/imageUpload',imageController.image,imageController.imageFileName);

routes.post('/v1/post',postController.postInserted);

routes.get('/v1/users/me',usersController.verifyUser,usersController.userDetail);

routes.get('/v1/users/detail',usersController.userIdDetail);

routes.get('/v1/users/posts',postController.getPosts);


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

routes.listen(1436);