var express     = require('express')
  , router      = express.Router()
  , loadModules = require('node-load-modules')
  , controllers;

// ### load all controllers
controllers = loadModules({
  moduleDir      : __dirname + '/controllers',
  skipControllers: ['']
});

// ### ROUTES DEFINITIONS
// # Specific routes
router.post('/locations' ,                 controllers.api.locations.listWithAncestors);
router.get ('/locations/searchindex',      controllers.api.locations.searchIndex);
router.get ('/locations/search/:q',        controllers.api.locations.search);
// ##################################################################################################### //
// POST route so that Angular can pass long array of IDs easily; GET route for browser debugging
// in the future, it'd be great if we could have a unique (device/user) Id to store user locations
// Ids with that, and then always send out filtered data without client sending Ids over to server
router.post('/locations/content/:content', controllers.api.locations.subitems.withAncestors);
router.get ('/locations/content/:content', controllers.api.locations.subitems.withAncestors);
// ##################################################################################################### //
router.get ('/locations/:id/ancestors',    controllers.api.locations.ancestors);
router.get ('/locations/:id/:content',     controllers.api.locations.subitems.byLocationWithAncestors);
router.post('/:collection',                controllers.api.byIds);

// # Generic routes
router.get('/:collection',               controllers.api.index);
router.get('/:collection/:id',           controllers.api.read);
router.get('/:collection/:relation/:id', controllers.api.related);

// ### Publicly exposed functions from the module
module.exports = router;
