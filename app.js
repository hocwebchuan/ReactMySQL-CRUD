const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'reactUser',
  password: '1234567',
  database: 'reactmysql'
});

connection.connect(function(err){
  (err) ? console.log(err) : console.log(connection);
});

app.get('/api/news', (req, res) => {
  var sql = "SELECT * FROM news ORDER BY id DESC";
  connection.query(sql, function(err, results) {
    if (err) throw err;
    res.json({news: results});
  });
});

app.post('/api/insert', function(req, res) {
  var sql = "INSERT "
          + "INTO news(title,description,content) "
          + "VALUES('"
          +   req.body.title+ "','" 
          +   req.body.description + "','" 
          +   req.body.content+"')";
  connection.query(sql, function (err, results) {
    if(err) throw err;
    res.json({news: results});
  });
});

app.post('/api/edit', (req, res) => {
  var sql = "UPDATE news SET "
          +   "title='"+req.body.title+"',"
          +   "description='"+req.body.description+"',"
          +   "content='"+req.body.content+"'"
          + "WHERE id='"+req.body.id+"'";
  connection.query(sql, function(err, results) {
    if (err) throw err;
    res.json({news: results});
  });
});

app.post('/api/delete', (req, res) => {
  var sql = "DELETE FROM news "
          + "WHERE id='"+req.body.id+"'";
  connection.query(sql, function(err, results) {
    if (err) throw err;
    res.json({news: results});
  });
});
 
app.listen(4000, () => console.log('App listening on port 4000'));