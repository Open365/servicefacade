/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var BusToExpressServer = require('../lib/busToExpressServer');
var vegetablesExpressServer = require('./vegetablesExpressServer');
var mongoose = require('mongoose');
var log2out = require('log2out');
var busToExpressServerSettings = require('./settings');
logger = log2out.getLogger('bustoexpressserver-integrationtest');

mongoose.connect('mongodb://mongo.service.consul:27017');

busToExpressServerSettings.httpServer.app = vegetablesExpressServer;

var server = new BusToExpressServer(busToExpressServerSettings);
logger.info("Start server", busToExpressServerSettings);
server.start();

setTimeout(function () {
	logger.info("Stop server");
	server.stop();
	process.exit(0);
}, 30000);