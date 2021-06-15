#!/bin/bash

npm run docs

if git ls-remote --heads --exit-code https://github.com/fgpv-vpgf/fgpv-vpgf.git gh-pages &> /dev/null; then
    echo "gh-pages exists - cloning ..."
    git clone --depth=50 --branch=gh-pages https://github.com/fgpv-vpgf/fgpv-vpgf.git ./docs

else
    echo "gh-pages does not exist!"
    mkdir docs
fi

# remove existing folder if present
if [ -d "docs/$REF_NAME" ]; then
    rm -rf "docs/$REF_NAME"
fi

# move generated docs into deployment folder
mv docs "docs/$REF_NAME"

# generate the index page with all the branches and tags
. scripts/docs/make_doc_index.sh docs > "docs/index.html"
touch docs/.nojekyll