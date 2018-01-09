const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://potato:potato@ds245337.mlab.com:45337/badguy', (err, db) => {

        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

//Get All Schemes
router.get('/schemes/', (req, res) => {
    connection((db) => {
        db.collection('scheming')
            .find()
            .toArray()
            .then((scheming) => {
                response.data = scheming;
                db.collection('henchmen')
                .find()
                .toArray()
                .then((henchmen) => {
                    response.data.push.apply(response.data, henchmen);
                    res.json(response);
                });
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});


module.exports = router;