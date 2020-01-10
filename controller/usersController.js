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
        phone:req.body.phone,
        email:req.body.email,
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

function verifyUser(req,res,next){
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        let err = new Error("Bearer token is not set!");
        err.status = 401;
        return next(err);
    }
    var token = authHeader.slice(7,req.headers.authorization.length)
    let data;
    try {
        data = jwt.verify(token, 'bikesh');
    } catch (err) {
        throw new Error('Token could not be verified!');
    }
    userModel.user.findOne({
        where:{id:data._id}
    })
        .then((user) => {
            req.user = user;
            next();
        })
}

function userDetail(req,res,next){
    console.log(req.user);
    res.json({ id: req.user.id, phone: req.user.phone, email: req.user.email, username: req.user.username, image: req.user.image });
}

function userIdDetail(req, res, next){
    userModel.user.findOne({
        where:{id:req.body.userId}
    })
    .then((user)=>{
        res.json({id: user.id, phone: user.phone, email: user.email, username: user.username, image: user.image})
    })
}


/*----------------------------------------------------------------------------------*/
// export----------------------
module.exports = {
    validation,
    hashGen,
    registerUser,
    validator,
    passwordCheck,
    jwtTokenGen,
    verifyUser,
    userDetail,
    userIdDetail
}
