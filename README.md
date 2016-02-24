Citizen Activation App
=========================

## Prerequisites

Citizen Activation App project expects that you have the necessary platforms
and tools installed - Git, Node.js; arbitrary MongoDB if a local instance used
in dev (recommended).

It also expect some global npm modules to be present on the system, so if you
don't have them already, install the following:

    $ sudo npm install -g grunt-cli bower phantomjs


## Getting Started

After pulling the repository, run the following to pull all dependencies:

    $ npm install
    $ bower install


#### Environment variables

Before running the application in any mode, environment variables for port
application will be listening at and MongoDB connection string need to be set.

In development environment, this should be sufficient (assuming you have
a default setup with no authentication set on your local MongoDB):

    export PORT=3000
    export MONGO_CONN_STRING=localhost:27017/caapp

These are best set by including the prepared `scripts/envvars.sh` from your
`~/.bash_profile` file by using
[`source` command](http://bash.cyberciti.biz/guide/Source_command), which
will ensure you have the required environment variables set in every instance
of your terminal running.


## Development build

Now that you have dependencies installed, you may run the _development_ build.
Execute the following commands, each in a separate terminal window (Linux and
Mac only):

    $ grunt

    $ ./dev

If everything went well, you should have CA App up and running - Express app
listening on port 3000 serving the Angular app.

Additionally, running in _development_ mode is configured to automatically
refresh (restart) Express app on any source code changes, while changes to the
client-side code are automatically picked up on browser refresh, as server is
serving `client/src/` content directly (`server/public` symlinked to there).


## Debug build

To run the _debug_ build, exectute the following command:

    $ grunt debug

Debug build concatenates all the source files into a single JS and CSS files,
precompiles client-side app templates and prepares everything to be served
with minimum amount of requests to server while loading the app.

Debug build **does not** minify/uglify distribution files, to allow finding the
sources of errors easily while debugging.

Serving _debug_ build locally requires the following command to be exectued to
have the server running:

    $ ./dev


## Production build

To run the _production_ build, exectute the following command:

    $ grunt release

Production build does everything the _debug_ build does, with addition of
minifying dist JS and CSS files to minimize the server traffic. It is used
to deploy a production running version of the app.

To serve _production_ build locally, also have the following command running:

    $ ./dev


## Production deployment

For a production deployment, the story is as follows - although source repo
does not contain build assets, those need to be pushed to Heroku. To do that,
a separate branch `heroku` should be created and used locally in which build
assets should be added (by using `git add -f`) and then pushed to heroku's
master branch.

Before pushing to heroku's git, heroku git remote repository needs to be
configured. More info at [Heroku's devcenter](https://devcenter.heroku.com/articles/git),
but in general it boils down to executing this:

    $ git remote add heroku git@heroku.com:ca-app.git

There is a utility function in `scripts/` directory which does the build and
adds the right files to git repo. Push needs to be done manually, if you have
the build passed correctly. From project root run the following:

    $ ./scripts/herokubuild.sh
    $ git push heroku heroku:master


#### Environment variables

Same as above, environment variables for application port and MongoDB connection
string need to be set before deploying the application They are set using
[Heroku's CLI](https://devcenter.heroku.com/articles/config-vars), while the
required values to set are found inside Heroku's dashboard for the application.

Configuration has been done for the current deployment environment, and it
needs to be redone only if the environment for hosting the app will change.


## Debug and Production build notes

Results of _debug_ and _release_ builds are compiled client-side assets that
are put in `build/dist/` directory, and also copied to `server/public/` for
Express app.

That allows the flexibility of CI and deployment automation, which may publish
assets to CDN for serving those static files without actually hitting the
Express app (infrastructure setup needed), with also having Express app ready
to serve those assets as well (a default option).
