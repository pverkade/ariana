#!/bin/bash

# implementation of vercomp thanks to Dennis Williamson
# see: http://stackoverflow.com/questions/4023830/bash-how-compare-two-strings-in-version-format
vercomp () {
    if [[ $1 == $2 ]]
    then
        echo 0
        return 0
    fi
    local IFS=.
    local i ver1=($1) ver2=($2)
    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++))
    do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++))
    do
        if [[ -z ${ver2[i]} ]]
        then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]}))
        then
            echo 1
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]}))
        then
            echo 2
            return 2
        fi
    done
    echo 0
    return 0
}

# this functions retrieves a version string from a string
retrieve_version_number() {
    input=$1
    pattern="[0-9]+(\.[0-9]+)+"
    [[ $input  =~ $pattern ]]

    result=${BASH_REMATCH[0]}
    echo $result
}
errors=0

# this function test if a package is of correct version.
#
# $1: name of the program, to be used in error communication
# $2: string that contains the version number
# $3: string of version number that the program atleast needs to have
#
# example usage:
#   test_package "grep" "`grep --version`" '2.21'
test_package() {
    name=$1
    input=$2
    atleast=$3

    version=`retrieve_version_number "$input"`
    result=`vercomp $version $atleast`

    if [[ -z $version ]]
    then
        errors=$((errors + 1))
        echo "$name could not be found"
        return 1
    elif [[ $result == 2 ]]
    then
        errors=$((errors + 1))
        echo "Found version $version for $name, needed atleast $atleast"
        return 1
    fi

    echo "Found $name and is of correct version"
    return 0
}

errors=0

npm_version='1.3.6'
bower_version='1.4.1'
gruntcli_version='0.1.13'
imagemagick_version='6.8.8'
karma_version="0.12.36"

test_package "npm" "`npm --version`" $npm_version
test_package "bower" "`bower --version`" $bower_version

version_input="`grunt --version | grep grunt-cli`"
test_package "grunt-cli" "$version_input" $gruntcli_version

test_package "ImageMagick" "`convert --version | grep Version:`" $imagemagick_version
test_package "karma" "`karma --version`" $karma_version

echo --------------------
if [[ $errors == 0 ]]
then
    echo All dependencies found
else
    echo Not everey dependancy could be found. Exiting...
    exit 1
fi


echo Installing npm dependancies...
sleep 1
npm install
if [[ $? -ne 0 ]]
then
    echo Failed to install npm dependancies
    exit 1
fi

echo Installing bower dependancies...
sleep 1
bower install
if [[ $? -ne 0 ]]
then
    echo Failed to install bower dependancies
    exit 1
fi

echo Building application
sleep 1
grunt
if [[ $? -ne 0 ]]
then
    echo Failed to build applications
    exit 1
fi

echo The server can be started with:
echo "  node server.js [--production]"

echo -n "Start the server [y/n]? "
read STARTSERVER
if [[ $STARTSERVER == "y" ]]
then
    node server.js
fi
