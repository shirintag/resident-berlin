const express = require('express');
const MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
const app = express();


if (process.env.NODE_ENV != 'production') {
    app.use(require('./build'));
    const db_url = 'mongodb://127.0.0.1:27017/resident-berlin';
} else {
    const db_url = process.env.MONGO_URL;
}

app.use(express.static(__dirname + '/public'));

app.get('/api/events/:date', function (req, res) {
    let date = new Date(req.params.date);

    MongoClient.connect(db_url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        let events = db.collection('events');
        events.findOne({'date': date}, function (err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs);
            res.json(docs);
            db.close();
        });
    })

});


app.listen(8080, function() {
    console.log("I'm listening at localhost:8080");
});
