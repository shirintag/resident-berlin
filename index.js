var spicedPg = require('spiced-pg');
var config = require('./passwords.json');
var db = spicedPg('postgres:' + config.name + ':' + config.password + '@localhost:5432/events');
// var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// var cookieSession = require('cookie-session');
var checkPass = require('./checkPass');
var hashPassword = checkPass.hashPassword;
const express = require('express');
const app = express();


if (process.env.NODE_ENV != 'production') {
    app.use(require('./build'));
}

app.use(express.static(__dirname + '/public'));
app.post('/residentberlin/signup', function(req, res) {
    // console.log(req.body);
    if (req.body.username && req.body.email && req.body.password) {
        hashPassword(req.body.password)
        .then(function(hash){
            return db.query("INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING id",
            [req.body.username, req.body.email, hash])
            .then(function(result){
                console.log(result);
                req.session.user = {
                    email :req.body.email,
                    username : req.body.username,
                    id : result.rows[0].id
                };
                res.json({
                    'username' : req.session.user.username,
                    'email' :  req.session.user.email
                });
                // console.log(req.session.user.username);
            });
        }).catch(function(err){
            console.log(err);
        });
    }
});

app.post('/residentberlin/login', function(req, res) {
    // console.log(req.body);
    if (req.body.username && req.body.password){
        db.query("SELECT users.username, users.id, password FROM users WHERE username = $1",
        [req.body.username]).then(function(result){
            // console.log(result.rows);
            hashPassword(req.body.password, result.rows[0].password).then(function(doesMatch){
                if(doesMatch){
                    console.log('match!');
                    req.session.user = {
                        username : result.rows[0].username,
                        email : req.body.email,
                        password : result.rows[0].password,
                        id : result.rows[0].id
                    };
                    // res.end();
                    res.send({
                        'username' : req.session.user.username
                    });
                    // console.log(req.session.user.username);
                } else {
                    console.log('No match');
                }
            }).catch(function(err){
                console.log(err);
            });

        }).catch(function(err){
            console.log(err);
        });
    }
});

app.post('/berlinevents/addevent', function(req, res){
    // console.log(req.body);
    db.query("INSERT INTO events(link, title, user_id, username) VALUES ($1, $2, $3, $4) RETURNING id",
    [req.body.url, req.body.title, req.session.user.id, req.session.user.username])
    .then (function(result) {
        // console.log(result + "Risultato Post");
        res.json({
            title: req.body.title,
            link: req.body.url,
            id: result.rows[0].id
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            success: false
        });
    });
});

app.get('/berlinevents', function(req, res){
    db.query('SELECT events.id, events.username, events.link, events.title, events.created_at, count(comments.link_id) FROM events LEFT JOIN comments on comments.link_id = events.id GROUP BY events.id ORDER by events.created_at DESC').then(function(results) {
        console.log(results.rows);
        res.json(
            {
                events: results.rows
            });
    }).catch(function(err) {
        console.log(err);
        res.json({
            success: false
        });
    });
});

app.get('/berlinevents/userinfo', function(req, res){
    Promise.all([
        db.query('SELECT users.username, users.email, links.id, links.link, links.title FROM users LEFT JOIN links on links.user_id = users.id  WHERE users.id = $1', [req.session.user.id]),
        db.query('SELECT events.title FROM events WHERE (events.user_id = $1)',[req.session.user.id])
    ]).then(function(results) {
        console.log(results[0].rows);
        // console.log(req.session.user);
        res.json({
            email :results[0].rows[0].email,
            username : results[0].rows[0].username,
            id : results[0].rows[0].id,
            links : results[0].rows,
            comments : results[1].rows,
        });
    }).catch(function(err){
        console.log(err);
    });
});


app.listen(8080, function() {
    console.log("I'm listening.");
});
