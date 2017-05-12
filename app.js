var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var assert = require("assert");
var url = 'mongodb://localhost:27017/mongotest';
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

app.post('/mongodb/newUser', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        var newRecord = {
            firstName: req.body[0].value,
            lastName: req.body[1].value,
            email: req.body[2].value
        };
        db.collection('users').insertOne(newRecord, function (err, r) {
            assert.equal(null, err);
            assert.equal(1, r.insertedCount);
            if (r.insertedCount == 1) {
                console.log(r.insertedCount + ' row(s) inserted');
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        });
        db.close();
    });
}); // app.post finished

app.get('/mongodb/viewUser', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        console.log('the value of searchInput is '+req.query.searchInput);
        if(req.query.searchInput){
            console.log('searchInput found');
            var regex = new RegExp(req.query.searchInput, 'i');
            db.collection('users').find(
                { $or: [ {firstName: regex}, {lastName: regex}, {email: regex} ] })
                .toArray(function(err, docs) {
                    assert.equal(err, null);
                    console.log('The query returned ' + docs.length + ' documents');
                    console.log(docs);
                    res.json(docs);
                });
        } else {
            console.log('no searchInput found');
            db.collection('users').find({}).toArray(function(err, docs) {
                assert.equal(err, null);
                console.log('The query returned ' + docs.length + ' documents');
                console.log(docs);
                res.json(docs);
            });
        }
        
        db.close();
    });
}); // app.post finished


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});