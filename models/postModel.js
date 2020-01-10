var db = require('../config/db_connection');
var userModel = require('../models/usersModel');
var post = db.sequelize.define('posts',{
    id:{
        type:db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    post: {
        type: db.Sequelize.STRING,
        allowNull: false,
        required: true
    },
    image: {
        type: db.Sequelize.STRING,
        allowNull: true,
        required: true
    }
   
},
{
    //-----to set table name as given-----
    // freezeTableName: true,
    paranoid: true

});

userModel.user.hasMany(post);
post.belongsTo(userModel.user);

post.sync({force : false})
.then(function(){

})
.catch(function(err){
    console.log(err);
})

module.exports = {post}