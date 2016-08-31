
// import express module
var express = require("express");

// body-parser is required for parsing the json data from POST request's body.
var bodyParser = require("body-parser");

// The convension for declaring variable for underscore is to use '_'.
// It is required for a set of utilities and validation purposes.
// It is used as a middleware with Express using app.use()
var _ = require("underscore");

// Bcrypt library is used to hasing the password before storing
var bcrypt = require('bcrypt-nodejs');

// Used for creating HTTP based simulated devices
var clientSim = require("./app/modules/simulator/client_http")

// instantiating express
var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);

// process.env.PORT is the port number set by Heroku..for local server the 9000 port would be used
// as process.env.PORT is not supplied in the local env
var PORT = process.env.PORT || 9000;

// using bodyparser as a middleware
app.use(bodyParser.json());

// to be replaced with Mongo DB
var hashMap = require('hashmap');

var deviceDB = new hashMap();



var io = require('socket.io')(http);

io.on('connection', function (socket) {
    console.log("connection initiated from " + (socket.toString()));

    socket.on('message', function (message) {
        console.log("message received " + message.text);
        socket.broadcast.emit('message', message);
    });
})
var devicePrefix = "HTTPSIM000";
var UniqueNumber = 0;

// the following is an example of path specific middleware(pathSpecificLogger), which is used as a second argument of the route difinition
app.get("/about", function (req, resp) {
    resp.send("About items are listed here");
});


app.post("/device", function (req, resp) {
    console.log('Enter into device create method');
    resp.send("About items are listed here" + JSON.stringify(req.body, null, 2));
});

app.post("/devices/status/:deviceId",
    function (req, resp) {
        var deviceId = req.params.deviceId;
        console.log("status received from  " + deviceId);
        console.dir(req.body);
        io.emit('message', req.body);
        resp.status(200).send();
    });

app.post("/devices/activate/:deviceId",
    function (req, resp) {
        var deviceId = req.params.deviceId;
        console.log("activate is getting called for " + deviceId)
        var interval = setInterval(() => { clientSim.sendStatus(deviceId) }, 2000);
        deviceDB.set(deviceId, interval);
        resp.status(200).send();

    });

app.post("/devices/deactivate/:deviceId",
    function (req, resp) {
        var deviceId = req.params.deviceId;
        console.log("deactivate device is getting called for " + deviceId)
        var interval = deviceDB.get(deviceId); //setInterval(() => { clientSim.sendStatus(deviceId) }, 2000);
        // deviceDB.put(deviceId, interval);
        console.log(`timer obj retrieved from db for device id ${deviceId} is ${interval}`)
        clearInterval(interval);
        resp.status(200).send();

    });

app.post("/devices/create",
    function (req, resp) {
        UniqueNumber += 1;
        var deviceId = devicePrefix + UniqueNumber;
        console.log("generated device id " + deviceId);
        resp.status(200).json(deviceId);
    });

app.use(express.static(__dirname + "/app/public"));

http.listen(PORT, function (error, success) {
    if (error) {
        console.log("server startup failed");
    } else {
        console.log("server is started at port " + PORT + " press [ctrl+c] to exit!!");
    }
});


// //GET an individual todo with ID=:id
// app.get("/todos/:id", requireauthMW.requires,
//     function(req, resp) {
//         var todoId = parseInt(req.params.id, 10);
//         db.todo.findById(todoId).then(function(todo) {
//             if (todo) {
//                 resp.status(200).json(todo.toJSON());
//             } else {
//                 console.log("Error");
//                 resp.status(404).send();
//             }

//         }).catch(function(error) {
//             console.log("Error");
//             resp.status(404).send();


//         });

//     }
// );


// // create new todo item
// app.post("/todos", requireauthMW.requires,
//     function(req, resp) {
//         // using body-parser provides the feature of req.body to be used
//         var body = req.body;
//         db.todo.create({
//             description: body.description,
//             completed: body.completed
//         }).then(function(todo) {
//             resp.status(200).json(todo.toJSON());
//         }).
//         catch(function(error) {
//             resp.status(400).json(error);
//         })
//     }
// );


// // create new todo item
// app.post("/users",
//     function(req, resp) {
//         // using body-parser provides the feature of req.body to be used
//         var body = _.pick(req.body, 'email', 'password');
//         db.user.create(body).then(function(user) {
//             resp.status(200).json(user.toBareUser());
//         }).
//         catch(function(error) {
//             resp.status(400).json(error);
//         })
//     }
// );

// app.post("/users/login",
//     function(req, resp) {
//         // using body-parser provides the feature of req.body to be used
//         var body = _.pick(req.body, 'email', 'password');
//         var generatedToken;
//         // authenticate the user
//         db.user.authenticate(body).then(
//             // for successfull authentication wiil have the user instance populated
//             function(user) {
//                 // generate the token
//                 generatedToken = user.generateJwtToken('Authentication');
//                 // create the token by hashing it in DB
//                 db.token.create({
//                         token: generatedToken
//                     }).
//                     // setting the auth header
//                 then(function() {
//                     resp.header('AUTH', generatedToken).status(200).json(user.toBareUser())
//                 })
//             },
//             function() {
//                 resp.status(401).send();
//             }).
//         catch(function(err) {
//             console.log(err);
//             resp.status(500).send();
//         })
//     }
// );

// app.post("/users/logout", requireauthMW.requires,
//     function(req, resp) {
//         req.token.destroy().then(resp.status(204).send());
//     }
// )


//if you dont provide any route for the "/" , this would get autometically invoked
// __dirname  => is an predefined variable within node which gives the path of current working directory

