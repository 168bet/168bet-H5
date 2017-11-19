#!/bin/bash

if [ "$1" == "" ]; then
	echo "usage: sh build.sh projectName/all env(sandbox or null)"
	exit 0
fi

if [ "$1" == "all" ]; then
    source ./getProjects.sh
else
    PROJECTS[0]=$1
fi

ENV=$2

for PROJECT_NAME in ${PROJECTS[*]}
do
    echo "building" ${PROJECT_NAME}

    rm -rf dist
    mkdir dist
    node index.js ${PROJECT_NAME} ${ENV}
    grunt
done

#PROJECT_NAME=$1
