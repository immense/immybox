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

echo "Switching to gh-pages branch"
git checkout gh-pages

echo "Resetting gh-pages to $1"
git reset --hard "$1"

echo "Reinstalling node modules"
rm -rf node_modules
npm install

echo "Building"
npm run build

echo "Removing the things we don't need"
# remove everything but the build, demo and .git directories
for file in `ls -a | awk '!/^..?$|build|demo|^.git$/'`; do
  rm -rf "$file"
done

echo "Creating CNAME file"
# create CNAME file
printf "immybox.js.org" > CNAME

echo "Moving demo content into place"
# flatten demo dir
mv demo/* .

# remove index.js (we only need index-es5.js)
rm -rf index.js
rm -rf demo
