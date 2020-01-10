var postModel = require('../models/postModel');
var userModel = require('../models/usersModel');

function postInserted (req,res){
    postModel.post.create({
        post:req.body.post,
        image:req.body.image,
        userId: req.body.userid
    })
    .then(function(result){
        console.log(result);
        if(result === null){
            next({
                status:404,
                message:"post not inserted"                
            })
        }
        else{
            res.json(result);          
        }
        
    })
    .catch(function(err){
        console.log(err);
    })
}

function getPosts(req,res,next){
    postModel.post.findAll()
    .then(result => {
        res.json(result);

    });
        
}

module.exports = {postInserted,getPosts}