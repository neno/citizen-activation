// ### Database connection module using mongojs
var mongojs          = require('mongojs')
//  , connectionString = process.env.MONGO_CONN_STRING     // mandatory env var
, connectionString = 'mongodb://heroku_w5067d4b:ck74amh8i46vrdk9h37f5fu2pv@ds055915.mongolab.com:55915/heroku_w5067d4b'     // mandatory env var
, collections;

// Enumerate all MongoDB collections to expose
collections = [
    'locations'
    , 'deadlines'
    , 'news'
    , 'civilRights'
    , 'labels'
];

module.exports = {
    db        : mongojs.connect(connectionString, collections)
    , ObjectId  : mongojs.ObjectId    // a function that generates mongo object ID
};
