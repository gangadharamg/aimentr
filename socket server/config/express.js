var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var config = require('./config')
var path = require('path');

var app = express();

module.exports = () => {
  
    app.use(cors())

    app.use(express.static(path.join(__dirname, '../public')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'))
    })

    app.use(bodyParser.json({
        limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }));


    return app;
}