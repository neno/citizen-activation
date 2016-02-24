#!/bin/sh

DIR="$( cd "$( dirname "$0" )" && pwd )"
cd ${DIR}/..

grunt clean
git checkout heroku
git merge master
git rm -rf server/public/
grunt debug
git a -f server/public/
git status
git ci -m "Deployment"

exit 0

