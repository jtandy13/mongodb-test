var express = require('express');
var bodyParser = require('body-parser');
var db = require('./database.js');
//var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;
var assert = require("assert");
//var url = 'mongodb://localhost:27017/mongotest';
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

// Connect to Mongo on start
db.connect('mongodb://localhost:27017/mongotest', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }
})

app.post('/mongodb/newUser', function (req, res) {
    var newRecord = {
        firstName: req.body[0].value,
        lastName: req.body[1].value,
        email: req.body[2].value
    };
    db.get().collection('users').insertOne(newRecord, function (err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
        if (r.insertedCount == 1) {
            console.log(r.insertedCount + ' row(s) inserted');
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    });
}); // app.post /mogodb/newUser finished

app.post('/mongodb/modifyUser', function (req, res) {
    var updateDoc = {
        _id: req.body[0].value,
        firstName: req.body[1].value,
        lastName: req.body[2].value,
        email: req.body[3].value
    };
    console.log(updateDoc);
    db.get().collection('users').findOneAndUpdate({_id: ObjectId(updateDoc._id)}, 
        {$set: {firstName: updateDoc.firstName, lastName: updateDoc.lastName, 
            email: updateDoc.email}
    });
}); //app.post /mongodb/modifyUser finished

app.get('/mongodb/viewUser', function (req, res) {
    if(req.query.searchInput){
        console.log('searchInput found');
        var regex = new RegExp(req.query.searchInput, 'i');
        db.get().collection('users').find(
            { $or: [ {firstName: regex}, {lastName: regex}, {email: regex} ] })
            .toArray(function(err, docs) {
                assert.equal(err, null);
                console.log('The query returned ' + docs.length + ' documents');
                console.log(docs);
                res.json(docs);
            });
    } else {
        console.log('no searchInput found');
        db.get().collection('users').find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log('The query returned ' + docs.length + ' documents');
            console.log(docs);
            res.json(docs);
        });
    }
}); // app.post finished
