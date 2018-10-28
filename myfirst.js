var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}))

var pg = require('pg');
var pgClient = new pg.Client('postgres://postgres:postgres@localhost:5432/memo');
pgClient.connect();


/**
 * Html Includes
 */
app.get('/', function (req, res) {
    fs.readFile('./index.html', 'utf8', function (err, html) {
        res.send(html);
    });
});
/**
 * CSS Includes
 */
app.get('/app/include/css/css.css', function (req, res) {
    fs.readFile('./app/include/css/css.css', 'utf8', function (err, html) {
        res.send(html);
    });
});

/**
 * Javascript Includes
 */
app.get('/app/include/lib/jquery-3.3.1.js', function (req, res) {
    fs.readFile('./app/include/lib/jquery-3.3.1.js', 'utf8', function (err, html) {
        res.send(html);
    });
});
app.get('/app/include/js/index.js', function (req, res) {
    fs.readFile('./app/include/js/index.js', 'utf8', function (err, html) {
        res.send(html);
    });
});
//bootstrap js
app.get('/app/include/lib/bootstrap/js/bootstrap.js', function (req, res) {
    fs.readFile('./app/include/lib/bootstrap/js/bootstrap.js', 'utf8', function (err, html) {
        res.send(html);
    });
});
//bootstrap css
app.get('/app/include/lib/bootstrap/css/bootstrap.css', function (req, res) {
    fs.readFile('./app/include/lib/bootstrap/css/bootstrap.css', 'utf8', function (err, html) {
        res.send(html);
    });
});


/**
 * REST API
 */
/**
 * list all memos
 */
app.get('/memo', function (req, res) {
    pgClient.query("select * from memo", function (pg_err, pg_res) {
        if (pg_err) {
            console.log(err.stack);
        } else {
            res.send({ response: pg_res.rows });
        }
    });
});
/**
 * create a memo
 */
app.post('/memo', function (req, res) {
    console.log(req.body);
    pgClient.query('insert into memo("title","description", "expire_date") values ($1, $2, $3)', [
        req.body.title,
        req.body.description,
        req.body.expire_date || new Date()
        //req.body.date,
    ], function (pg_err, pg_res) {
        if (pg_err) {
            res.send({
                success: false,
                error: pg_err.stack
            })
        } else {
            res.send({
                success: true,
                data: [{ //TODO: better way for returning the inserted row
                    title: req.body.title,
                    description: req.body.description,
                    expire_date: req.body.expire_date
                }]
            });
        }
    });
});

/**
 * get specific memo
 */
app.get('/memo/:memoId', function (req, res) {
    pgClient.query('select * from memo where id = $1', [
        req.params.memoId
    ], function (pg_err, pg_res) {
        if (pg_err) {
            res.send("can't find memo with id: " + req.params.memoId);
        } else {
            res.send(pg_res.rows);
        }
    });
})

/**
 * delete a specific row
 */
app.delete('/memo/:memoId', function (req, res) { //TODO:verify correctnessof delet rest api
    pgClient.query('delete from memo where id = $1', [
        req.params.memoId
    ], function (pg_err, pg_res) {
        if (pg_err) {
            res.send("cannot delete memo with id: " + req.params.memoId)
        } else {
            res.send("Cancellation competed");
        }
    })
});
/**
 * changes information about a memo
 */
app.put('/memo/:memoId', function (req, res) {
    var body = req.body;
    var query = "Update memo set "
    var params = [];
    var i = 1;

    for (var pars in body) {
        params.push(body[pars]);
        var tmp_Q = pars + " = $" + i + ',';

        query += tmp_Q
        i++;
    }
    query = query.substring(0, query.length - 1);
    query = query + " where id = " + req.params.memoId;

    pgClient.query(query, params,
        function (pg_err, pg_res) {
            if (pg_err) {
                console.log(pg_err.stack);
                console.log(query);
                res.send('cannot update memo with id' + req.param.memoId);
            } else {
                res.send('Updatet')
            }
        })
});

app.listen(8080);