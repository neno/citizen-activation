var _          = require('lodash')
  , moment     = require('moment')
  , repository = require('../data/repository');

function getContentQuery(content) {
  switch (content) {
    case 'deadlines':
      return { date: { $gte: moment({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).toDate() } };

    default:
      return {};
  }
}

function queryByLocationContent(locationId, collection, contentQuery, callback) {
  contentQuery = contentQuery || {};
  repository.findById('locations', locationId, function(err, doc) {
    if (err) { return callback(err); }
    contentQuery.location = { $in: _.union([doc._id], _.values(doc.ancestors)) };
    repository.find(collection, contentQuery, callback);
  });
}

function queryWithAncestorsContent(locationsIds, collection, contentQuery, callback) {
  var locationsQuery;
  locationsIds = locationsIds || [];
  contentQuery = contentQuery || {};

  locationsIds   = _.map(locationsIds, function (id) { return repository.getObjectId(id); } );
  locationsQuery = _.isEmpty(locationsIds) ? {} : { _id: { $in: locationsIds } };

  repository.find('locations', locationsQuery, function (err, locations) {
    var contentLocationsIds;
    if (err) { return callback(err); }

    // nevermind the duplicates, won't affect the mongo query below
    contentLocationsIds = _.reduce(locations, function (contentLocationsIds, location) {
      return contentLocationsIds.concat(_.union([location._id], _.values(location.ancestors)));
    }, []);
    contentQuery.location = { $in: contentLocationsIds };

    repository.find(collection, contentQuery, function (err, deadlines) {
      var result = {};
      if (!err) {
        _.each(locations, function (location) {
          var locationDeadlines = _.select(deadlines, function (deadline) {
            return _.contains(_.map(_.union([location._id], _.values(location.ancestors)), String), String(deadline.location));
          });
          result[location._id] = locationDeadlines;
        });
      }
      callback(err, result);
    });
  });
}

// POST locations' with ancestors associated content
exports.withAncestors = function withAncestorsContent(req, res) {
  var contentQuery = getContentQuery(req.params.content);
  queryWithAncestorsContent(req.body.locationsIds, req.params.content, contentQuery, function (err, result) {
    if (err) { return res.json(err, 500); }
    res.json(result);
  });
};

// GET location's associated content
exports.byLocationWithAncestors = function contentByLocation(req, res) {
  var contentQuery = getContentQuery(req.params.content);
  queryByLocationContent(req.params.id, req.params.content, contentQuery, function (err, result) {
    if (err) { return res.json(err, 500); }
    res.json(result);
  });
};
