var repository = require('../data/repository');

// export specific APIs
exports.locations = require('./api.locations');

// GET :collection list
exports.index = function index(req, res) {
  repository.findAll(req.params.collection, function (err, docs) {
    if (err) { res.json(err, 500); }
    else { res.json(docs); }
  });
};

// POST get :collection documents by IDs
exports.byIds = function byIds(req, res) {
  repository.findByIds(req.params.collection, req.body.ids, function (err, docs) {
    if (err) { res.json(err, 500); }
    else { res.json(docs); }
  });
};

// GET :collection document by id
exports.read = function read(req, res) {
  repository.findById(req.params.collection, req.params.id, function(err, doc) {
    if (err) { res.json(err, 500); }
    else { res.json(doc); }
  });
};

// GET :collection document's :related documents
exports.related = function related(req, res) {
  repository.findRelated(req.params.collection, req.params.relation, req.params.id, function(err, doc) {
    if (err) { res.json(err, 500); }
    else { res.json(doc); }
  });
};
