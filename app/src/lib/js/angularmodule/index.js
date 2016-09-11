'use strict';

// dependencies for angularjs
var angular = require('angular');
require('angular-route')

// defining the module
var app = angular.module('iotapp', ['ngRoute']);

// adding angular controllers
// Controller for log in page
app.controller('LoginFormCtrl', require('./controllers/LoginFormCtrl'));
// controller for home page
app.controller('HomeCtrl', require('./controllers/HomeCtrl'));
// Controller for Dashboard pages
app.controller('DashboardCtrl', require('./controllers/DashboardCtrl'));

// adding angular factories
app.factory('authInterceptor', require('./factories/AuthInterceptor'));
app.factory('userContext', require('./factories/userContext'));

// add the factory as an interceptor
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}])

// adding routes
app.config(require('./routeConfig/BasicRoutes'));