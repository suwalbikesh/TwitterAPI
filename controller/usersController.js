var userModel = require('../models/usersModel');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// For Registration of users--------------------------------
// checking username in database
function validation(req,res,next){
    if(req.body.username === null){
        next({status : 201,
            message : 'username is empty'
        })
    }
    else if(req.body.password === null){
        next({status : 201,
            message : 'password is empty'
        })
    }
    else if(req.body.image === null){
        next({status : 201,
            message : 'image is empty'
        })
    }
    else if(req.body.firstname === null){
        next({status : 201,
            message : 'firstname is empty'
        })
    }
    else if(req.body.lastname === null){
        next({status : 201,
            message : 'lastname is empty'
        })
    }
    // console.log(req.body.username);
    userModel.user.findOne({
    where:{username:req.body.username}
})
.then(function(result){
    if(result === null){
        next();
    }
    else{
        console.log("username already registered")
        next({
                status:201,
                message:"user already registered"                
            })
    }
})
.catch(function(err){
    console.log(err);
})
}

//encrypting password
function hashGen(req,res,next){
    console.log(req.body.password)
    saltRound = 10;
    bcrypt.hash(req.body.password, saltRound)
    .then(function(hash){
        console.log(hash);
        req.userHash = hash;
        next();
    })
    .catch(function(err){
        next(err);
    })
}

//Registering users
function registerUser(req, res, next){
    // console.log(req.body);
    // console.log(req.userHash);
    userModel.user.create({
        username:req.body.username,
        password:req.userHash,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        image:req.body.image
    })
    .then(function(result){
        console.log(result.dataValues.id);
        if(result === null){
            next({
                status:404,
                message:"user not registered"                
            })
        }
        else{
            req._id = result.dataValues.id;
            next();           
        }
        
    })
    .catch(function(err){
        console.log(err);
    })

}

/*------------------------------------------------------------------------------------*/
//for login--------------------------------------
function validator(req, res, next){
    // console.log(userModel);
    if(req.body.username === null){
        next({status : 201,
            message : 'username is empty'
        })
    }
    else if(req.body.password === null){
        next({status : 201,
            message : 'password is empty'
        })
    }
    //registered or not
    userModel.user.findOne({
        where:{username:req.body.username}
    })
    .then(function (result){
        if(result === null){
            next({status : 201,
                message : 'you have not registered'
            })
        }
        else {
            // console.log(result);
            req._id = result.dataValues.id;
            req.passwordFromDB = result.dataValues.password;

            next();
        }

    })
    .catch(function(err){
        next(err);
    })

}

function passwordCheck(req, res, next){
    bcrypt.compare(req.body.password, req.passwordFromDB)
    .then(function(result){
        if(result === true){
            next();
        }
        else{
            next({
                status : 201,
                message : 'invalid password'
            })
        }
    })
    .catch(function(err){
        next(err);
    })
}

function jwtTokenGen(req,res){
    var payloadd = {
        _id : req._id
    };
    jwt.sign(payloadd,'bikesh',function(err,resultToken){
        console.log(payloadd);
        res.json({status:"Successful","usertoken":resultToken});
    });

    // console.log(jwt);
}


/*----------------------------------------------------------------------------------*/
// export----------------------
module.exports = {
    validation,
    hashGen,
    registerUser,
    validator,
    passwordCheck,
    jwtTokenGen
}
