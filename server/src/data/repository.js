var _           = require('lodash')
  , Db          = require('./db')
  , db          = Db.db
  , getObjectId = exports.getObjectId = Db.ObjectId;

// find
exports.find = function find (collection, query, callback) {
  query = query || {};
  db[collection].find(query, callback);
};

// findOne
exports.findOne = function findOne (collection, query, callback) {
  query = query || {};
  db[collection].findOne(query, callback);
};

// findAll
exports.findAll = function findAll (collection, callback) {
  this.find(collection, {}, callback);
};

// findById
exports.findById = function findById (collection, id, callback) {
  this.findOne(collection, { _id : Db.ObjectId(id) }, callback);
};

// findRelated
exports.findByIds = function findRelated (collection, ids, callback) {
  this.find(collection, { _id: { $in: _.map(ids, Db.ObjectId) } }, callback);
};

// findRelated
exports.findRelated = function findRelated (collection, relation, id, callback) {
  var query = {};
  query[relation] = Db.ObjectId(id);
  this.find(collection, query, callback);
};
