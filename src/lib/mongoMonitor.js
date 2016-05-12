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

var util = require('util');
var events = require('events');
var MongoConnection = require('../lib/mongoConnection');
var log2out = require('log2out');
var logger = log2out.getLogger('MongoMonitor');


var MongoMonitor = function(host, port, db, mongoConnection) {
	this.mongoConnection = mongoConnection || new MongoConnection(host, port, db);
	this.opened = false;
};

util.inherits(MongoMonitor, events.EventEmitter);

MongoMonitor.prototype.connect = function() {
	logger.info('Connect...');
	var self = this,
		conn = this.mongoConnection.connect();

	conn.on('connected', function () {
		logger.info('Connected');
		self.opened = true;
		self.emit('open');
	});

	conn.on('close', function () {
		logger.info('Close');
		self.opened = false;
		self.emit('close');
	});

	conn.on('error', function (e) {
		logger.info('Error', e);
		self.opened = false;
		self.emit('error');
	});
};

MongoMonitor.prototype.isOpen = function () {
	return this.opened;
};

module.exports = MongoMonitor;
