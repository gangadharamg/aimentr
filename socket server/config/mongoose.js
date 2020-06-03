var config = require('./config')
var mongoose = require('mongoose')

module.exports = () => {
    mongoose.connect(config.db, { useCreateIndex: true , useNewUrlParser: true ,  useUnifiedTopology: true }, function (err, connection) {
        if (err) {
            console.log('DB connection error');
        } else {
            console.log('Connected to DB ');
        }
    });

    var db = mongoose.connection;

    return db;

}

