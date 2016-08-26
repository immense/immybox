#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "Please provide the git branch to use"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Please commit and/or clean up your git environment first"
  exit 1
fi

git checkout gh-pages
git reset --hard "$1"
# rm -rf node_modules
# npm install
# npm run build
#
# # remove everything but the build, demo and .git directories
# for file in `ls -a | awk '!/^..?$|build|demo|^.git$/'`; do
#   rm -rf "$file"
# done
#
# # create CNAME file
# printf "immybox.js.org" > CNAME
#
# # flatten demo dir
# mv demo/* .
#
# # remove index.js (we only need index-es5.js)
# rm -rf index.js
