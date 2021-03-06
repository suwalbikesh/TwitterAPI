var db = require('../config/db_connection');
var user = db.sequelize.define('users',{
    id:{
        type:db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    phone: {
        type: db.Sequelize.STRING,
        allowNull: true,
        required: true
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: true,
        required: true
    },
    username: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique:true,
        required: true,
        minlength: 6
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: db.Sequelize.STRING,
        required: true,
        allowNull: false,
    }
},
{
    //-----to set table name as given-----
    // freezeTableName: true,
    paranoid: true

})

user.sync({force : false})
.then(function(){

})
.catch(function(err){
    console.log(err);
})

module.exports = {user}