const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require('../controllers/users.js')(mongoose);

module.exports = db;