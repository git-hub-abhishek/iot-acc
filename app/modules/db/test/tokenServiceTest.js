var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/iotaccdb');

var TokenService = require("../services/TokenService");
//var TokenData = {id:"token101",enterpriseNumber:"cus101",username:"Avishek",password:"Avishek"};
TokenService.createToken("AAA").then(function(res, err) {
    return TokenService.findToken("AAA")
}).then(function(res, err) {
    console.log(res);
})

;