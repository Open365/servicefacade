#!/bin/sh
set -e #Fail on error
set -u #Fail on variable bounds
set -x #Debugging

#Requirements for node-canvas, which is required by grunt
sudo yum install \
	cairo cairo-devel \
	libjpeg-turbo \
	libjpeg-turbo-devel \
	giflib \
	giflib-devel \
	libpng \
	libpng-devel

#Needed since we assume grunt is installed globaly
sudo npm install -g grunt-cli