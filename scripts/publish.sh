#!/usr/bin/env bash

###
# Compares a digit in a semantic version number.
#
# @param $1 The left hand side.
# @param $2 The right hand side.
# @param $3 The offset of the digit to compare (1-3).
#
# @return Returns `0` if the LHS is greater, or `1` if the RHS is greater or equal.
##
function compare
{
    local LHS="$(echo "$1" | cut -d- -f1 | cut -d+ -f1 | cut -d. -f$3)"
    local RHS="$(echo "$2" | cut -d- -f1 | cut -d+ -f1 | cut -d. -f$3)"

    if [ $LHS -gt $RHS ]; then
        return 0
    fi

    return 1
}

# Get the package name.
if ! NAME="$(jq -r .name package.json)"; then
    echo " Could not get name from package." >&2
    exit 1
fi

# Get the package version.
if ! VERSION="$(jq -r .version package.json)"; then
    echo "Could not get version from package." >&2
    exit 1
fi

# Get latest version on NPM.
if ! LATEST="$(npm view "$NAME" version)"; then
    echo "Could not get latest version from NPM." >&2
    exit 1
fi

# Print debugging information for posterity.
echo "Package: $VERSION"
echo "    NPM: $LATEST"
echo

# Assuming SemVer, abort if not newer.
if ! compare "$VERSION" "$LATEST" 1 && \
   ! compare "$VERSION" "$LATEST" 2 && \
   ! compare "$VERSION" "$LATEST" 3; then
   echo "NPM version is newer or current. Aborting." >&2
   exit
fi

# Create config .npmrc.
cat - > .npmrc <<'NPMRC'
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
NPMRC

# Publish the new version.
npm publish --access public
