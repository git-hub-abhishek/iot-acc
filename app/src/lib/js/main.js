// $ => the jquery in global scope
// window.jQuery is requried by bootstrap
window.jQuery = $ = require('jquery')
    // var $ = require("jquery");
var bootstrap = require('bootstrap');
var custom_bs_collapse = require('./custom-bs-collapse')


window.onload = function() {
    console.log('main js is invoked');
}