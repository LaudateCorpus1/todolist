var fs = require('fs');
var path = require('path');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var ensureLogin = require('connect-ensure-login');
var ICS = require('ics-js');
var moment = require('moment');
var app = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'todolist',
    charset: 'UTF8_UNICODE_CI'
});

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

function toMysqlFormat (date) {
    return date.getUTCFullYear() + "-" + twoDigits(1 + date.getUTCMonth()) + "-" + twoDigits(date.getUTCDate()) + " "
        + twoDigits(date.getUTCHours()) + ":" + twoDigits(date.getUTCMinutes()) + ":" + twoDigits(date.getUTCSeconds());
}

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn", err);
    }
});

passport.use(new Strategy(
    function(username, password, cb) {
        connection.query('SELECT * FROM user WHERE name = "' + username + '";', function(err, rows) {
            var user = rows[0];
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.pass != password) { return cb(null, false); }
            return cb(null, user);
        });
    })
);

passport.serializeUser(function(user, cb) {
    cb(null, user.user_id);
});

passport.deserializeUser(function(id, cb) {
    connection.query('SELECT * FROM user WHERE user_id = ' + id + ';', function (err, rows) {
        var user = rows[0];
        if (err) { return cb(err); }
        cb(null, user);
    });
});

app.set('port', (process.env.PORT || 3000));

app.use('/styles', express.static(path.join(__dirname, 'public/styles')));
app.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

var siteUrls = [
    {pattern:'^/login/?$', restricted: false},
    {pattern:'^/$', restricted: true},
    {pattern:'^/todos/\\w+/?$', restricted: true},
    {pattern:'^/todos/delete/\\w+/?$', restricted: true},
    {pattern:'^/todos/get/\\w+/?$', restricted: true},
    {pattern:'^/days/get/\\w+/?$', restricted: true},
    {pattern:'^/scripts/[\\w+.]*?$', restricted: true},
    {pattern:'^/logout/?$', restricted: true}
];

function authorizeUrls(urls) {
    function authorize(req, res, next) {
        var requestedUrl = url.parse(req.url).pathname;
        for (var ui in urls) {
            var pattern = urls[ui].pattern;
            var restricted = urls[ui].restricted;
            if (requestedUrl.match(pattern)) {
                if (restricted) {
                    if (req.isAuthenticated()) {
                        // если все хорошо, просто переходим к следующим правилам
                        next();
                        return;
                    }
                    else{
                        // пользователь не авторизирован, отправляем его на страницу логина
                        res.writeHead(303, {'Location': '/login'});
                        res.end();
                        return;
                    }
                }
                else {
                    next();
                    return;
                }
            }
        }
        // сюда мы попадаем, только если в цикле не нашлось совпадений
        console.log('common 404 for ', req.url);
        res.end('404: there is no ' + req.url + ' here');
    }
    return authorize;
}

app.use('/', authorizeUrls(siteUrls));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

function sentTODOS(req, res) {
    var date = moment(req.body.date);
    var q = 'select id, name, time, done, DATE_FORMAT(date, "%Y-%m-%d") AS date from todos WHERE user_id = ' + req.user.user_id +
        ' and date = "' + date.format("YYYY-MM-DD") + '";';
    connection.query(q, function(err, rows, fields) {
        if (!err)
            res.json(rows);
        else
            console.log('Error while performing READ Query.');
    });
}

app.post('/todos/get', sentTODOS);

app.get('/login', function(req, res){
        res.sendFile(__dirname + '/public/login.html');
});

app.get('/todos/export', function(req, res){
    res.sendFile(__dirname + '/public/export.html');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.post('/todos/change', function (req, res) {
    item = req.body;
    if (item.time == 0 || item.time == null) item.time = 'NULL';
    else item.time = '"' + item.time + '"';
    var q = 'UPDATE todos SET name="' + item.name + '", description="' + item.description +
        '", date="' + item.date + '", time=' + item.time + ', done=' + item.done +
        ' WHERE id = ' + item.id + ' and user_id = ' + req.user.user_id + ';';
    console.log(q);
    connection.query(q,
        function (err, rows, fields) {
            if (err) console.log('Error while performing UPDATE Query: ' + err);
            else res.send("Ok");
        });
});

app.post('/todos/add', function (req, res) {
    item = req.body;
    if (item.time == 0 || item.time == null) item.time = 'NULL';
    else item.time = '"' + item.time + '"';
    item.date = new Date(item.date).toISOString().slice(0, 10);
    var q = 'INSERT INTO todos (name, description, date, time, user_id, done) values ("' +
        item.name + '", "' + item.description + '", "' + item.date + '", ' + item.time + ', ' +
        req.user.user_id + ', ' + item.done + ');';
    console.log(q);
    connection.query(q,
        function (err, rows, fields) {
            if (err) console.log('Error while performing ADD Query: ' + err);
            else res.send("Ok");
        });
});

app.post('/todos/delete', function (req, res) {
    item = req.body;
    console.log(item);
    connection.query('DELETE FROM todos WHERE id = ' + item.id + ' and user_id = ' + req.user.user_id + ';',
        function (err, rows, fields) {
            if (err) console.log('Error while performing DELETE Query: ' + err);
            else res.send("Ok");
        });
});

app.post('/todos/delete/all', function (req, res) {
    connection.query('DELETE FROM todos WHERE user_id = ' + req.user.user_id,
        function (err, rows) {
            if (err) console.log('Error while performing DELETE ALL Query: ' + err);
            else res.send("Ok");
        });
});

app.post('/todos/delete/done', function (req, res) {
    connection.query('DELETE FROM todos WHERE done = true and user_id = ' + req.user.user_id,
        function (err, rows) {
            if (err) console.log('Error while performing DELETE DONE Query: ' + err);
            else res.send("Ok");
        });
});

app.post('/todos/delete/old', function (req, res) {
    var date = moment(req.body.date);
    var q = 'DELETE FROM todos WHERE user_id = ' + req.user.user_id +
        ' and date < "' + date.format('YYYY-MM-DD') + '"';
    connection.query(q, function (err, rows) {
            if (err) console.log('Error while performing DELETE OLD Query: ' + err);
            else res.send("Ok");
        });
});

app.post('/todos/delete/onday', function (req, res) {
    var date = moment(req.body.date);
    var q = 'DELETE FROM todos WHERE user_id = ' + req.user.user_id +
        ' and date = "' + date.format('YYYY-MM-DD') + '"';
    connection.query(q, function (err, rows) {
        if (err) console.log('Error while performing DELETE ON DAY Query: ' + err);
        else res.send("Ok");
    });
});

app.post('/days/get/active', function (req, res) {
    var month = req.body.month;
    var q = 'select DISTINCT DAY(date) as date from todos where user_id = ' + req.user.user_id + ' and MONTH(date) = ' + month + ";";
    connection.query(q, function (err, rows) {
        if (err) console.log('Error while performing GET ACTIVE DAYS Query: ' + err);
        else res.send(rows);
    });
});

app.get('/todos/get/all', function (req, res) {
    var q = 'select * from todos where user_id = ' + req.user.user_id + ";";
    connection.query(q, function (err, rows) {
        if (err) console.log('Error while performing GET ALL TODOS Query: ' + err);
        else res.send(rows);
    });
});

app.get('/logout',
    function(req, res){
        req.logout();
        res.redirect('/');
    });

app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);