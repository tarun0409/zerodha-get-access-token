var express = require('express');
var sha256 = require('sha256')
const qs = require('qs')
const axios = require('axios')
const fs = require('fs');
var app = express();

app.get('/', function(req, res){
    res.sendFile('views/login.html', {root: __dirname })
});

app.get('/request_token', function(req,res) {
    var rt = req.query.request_token
    var api_key = "b1nuuiufnmsbhwxx"
    var secret_key = "3azcz6fawz1bzet7bqe8624t7c9mkchp"
    var checksum_string =  api_key+rt+secret_key
    var checksum = sha256(checksum_string)
    axios({
        method: 'post',
        url: 'https://api.kite.trade/session/token',
        data: qs.stringify({
          api_key: api_key,
          request_token: rt,
          checksum:checksum
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).then(function (response) {
            fs.writeFile("../access_token.txt", response.data.data.access_token, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            }); 
      }).catch(function (error) {
            console.log(error)
      });
      res.sendFile('views/completed.html', {root: __dirname })
});

app.listen(3000);