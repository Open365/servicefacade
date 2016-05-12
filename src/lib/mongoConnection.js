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

var mongoose = require('mongoose');
var log2out = require('log2out');

function MongoConnection(host, port, db) {
	this.host = host;
	this.port = port;
	this.db = db;
	this.logger = log2out.getLogger('MongoConnection');
}

MongoConnection.prototype.connect = function() {
	this.logger.info("Connecting to mongo...");
	if (this.conn) {
		throw new Error("connect should be called only once");
	}

	this.conn = mongoose.connection;
	this.__openConnection(this.host, this.port, this.db);

	return this.conn;
};

MongoConnection.prototype.__openConnection = function(host, port, db) {
	var self = this;
	this.logger.debug("Opening connection to mongo");
	this.conn.open('mongodb://' + host + ':' + port + '/' + db, function(err) {
		if (!err) {
			self.logger.info("Connected to mongo!");
			return;
		}

		self.logger.error('Could not connect to mongo, reason:', err.message);

		self.conn.close(function() {
			self.logger.info('Attempting reconnectg in 1s');
			setTimeout(self.__openConnection.bind(self, host, port), 1000);
		});
		return;
	});
};

module.exports = MongoConnection;