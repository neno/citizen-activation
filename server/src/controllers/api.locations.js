var _          = require('lodash')
  , collection = 'locations'
  , repository = require('../data/repository');

exports.subitems  = require('./api.locations.subitems');

// GET locations starting with the given search query
exports.searchIndex = function searchIndex(req, res) {
  repository.find(collection, {}, function (err, docs) {
    if (err) { return res.json(err, 500); }
    res.json(_.map(docs, function (doc) { return _.pick(doc, '_id', 'name'); }));
  });
};

// GET locations starting with the given search query
exports.search = function search(req, res) {
  var query = {
    name: { $regex: new RegExp(['^', req.params.q].join(''), 'i') }
  };
  repository.find(collection, query, function (err, docs) {
    if (err) { return res.json(err, 500); }
    res.json(_.map(docs, function (doc) { return _.pick(doc, '_id', 'name'); }));
  });
};

// POST locations with ancestors
exports.listWithAncestors = function listWithAncestors(req, res) {
  repository.findByIds(collection, req.body.ids, function (err, locations) {
    var locationsWithAncestorsIds;
    if (err) { return res.json(err, 500); }

    // nevermind the duplicates, won't affect the mongo query below
    locationsWithAncestorsIds = _.reduce(locations, function (locationsWithAncestorsIds, location) {
      return locationsWithAncestorsIds.concat(_.union([location._id], _.values(location.ancestors)));
    }, []);

    repository.findByIds(collection, locationsWithAncestorsIds, function (err, docs) {
      if (err) { return res.json(err, 500); }
      else { res.json(docs); }
    });
  });
};

// GET location's ancestors
exports.ancestors = function ancestors(req, res) {
  repository.findById(collection, req.params.id, function (err, location) {
    if (err) { return res.json(err, 500); }
    else if (!location) { return res.send(404); }

    var ancestorsIds = _.values(location.ancestors);
    repository.findByIds(collection, ancestorsIds, function (err, docs) {
      if (err) { return res.json(err, 500); }
      else { res.json(docs); }
    });
  });
};
