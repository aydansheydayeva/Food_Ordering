var express = require('express');
var bodyParser = require('body-parser')
var mysql = require('mysql');
let alert = require('alert');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use('/scripts',express.static('scripts'));
app.use('/public',express.static('public'));
app.set('view engine', 'ejs');


var conn = mysql.createConnection({
    host: "192.168.100.103",
    user: "test",
    password: "123",
    database: "deliveryDB"
});
conn.connect(function(err) {
	if (err) throw err
	
});

app.get('/', function(req, res){
    res.render('./form.ejs');
})

app.post('/shop', function(req, res){
    //console.log(typeof req.body);
    //res.render('./shop.ejs',{post:req.body});
    //console.log('name', req.body.name);
    //console.log('email', req.body.email);
    //console.log('phone', req.body.number);

    var sql1 = "SELECT * FROM users WHERE userName=?";
    var values1 = [
        [req.body.name]
    ];

    conn.query(sql1, values1, function(err, result){
        if (err) throw err;
        else{
            //obj = {print: result}; //to assign a key for `result` array
            if (!result.length){
                //console.log('----->>>MATCH NOT FOUNDDD', result);
                var sql = "INSERT INTO users (userName, userEmail, userPassword, userPhone) VALUES ?";
                var values = [
                    [req.body.name, req.body.email, req.body.passwordd, req.body.number]
                ];
            
                conn.query(sql, [values], function(err, result){
                    if (err) throw err;
                })
                res.render('./shop.ejs',{post:req.body});
            }
            else{
                //console.log(result[0].userName, result[0].userEmail, result[0].userPhone);
                // check if user credentials are netered correcty, if yes then render to shop,
                // else alert
                if (result[0].userEmail === req.body.email && result[0].userPhone === req.body.number){
                    res.render('./shop.ejs',{post:req.body});
                }
                else{
                    alert('User data was incorrect!');
                    res.render('./form.ejs');
                }
                //console.log('------>>>>>>>>MATCH MATCH MATCH', result);
                //alert('message');
                //res.render('./form.ejs');
            }
        }
    })
})

app.get('/shop/:name', function(req, res){
    res.render('./shop.ejs', {post:req.params});
})

app.get('/history/:name', function(req, res){
    // pass to history.ejs
    //console.log(req.params.name);
    var namee = req.params.name;

    var sql = "SELECT * FROM usersHistory WHERE userName=?";
    var values = [
        [req.params.name]
    ];

    conn.query(sql, [values], function(err, result){
        if (err) throw err;
        else{
            console.log(result);
            res.render('./history.ejs', {items:result, namee: req.params.name});
            //for (var i of result){
                //console.log(i);
            //}
        }
    })
    //res.render('./history.ejs', {post:req.params});
})

app.get('/insert', function(req, res){
    console.log('inserted');
    //console.log("first",req.query.f);
    //console.log("second",req.query.s);
    var d = new Date();
    //console.log(d);
    var sql = "INSERT INTO usersHistory (mealName, userName, date) VALUES ?";
    var values = [
        [req.query.f, req.query.s, d]
    ]

    conn.query(sql, [values], function(err, result){
        if (err) throw err;
    })
})

app.get('/admin', function(req, res){
    res.render('./admin.ejs');
})

app.post('/admin_post', function(req, res){
    //console.log(req.body.email, req.body.password);
    if(req.body.email === "admin@gmail.com" && req.body.password === "admin111"){

        var sql = "SELECT * FROM users WHERE userName NOT IN ('admin')";
    
        conn.query(sql, function(err, result){
            if (err) throw err;
            else{
                res.render('./admin_page.ejs', {post:result});
                //console.log(result);
            }
        })
    }
    else{
        alert('Wrong admin credentials');
        res.render('./admin.ejs');
    }
})

app.post('/delete_users', function(req, res){
    var x = req.body.usersList;
    var list_of_users = [];
    if(typeof x === 'string'){
        list_of_users.push(x);
    }
    else{
        list_of_users = x;
    }

    list_of_users.forEach(user => {
        var sql = "DELETE FROM users WHERE userName = ?";
    
        conn.query(sql, [user], function(err, result){
            if (err) throw err;
            else{
                console.log('deleted');
            }
        }) 
    });

    var sqll = "SELECT * FROM users WHERE userName NOT IN ('admin')";
    
    conn.query(sqll, function(err, result){
        if (err) throw err;
        else{
            res.render('./admin_page.ejs', {post:result});
        }
    })
})

app.listen(3000);