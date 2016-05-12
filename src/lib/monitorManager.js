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

var EventEmitter = require('events').EventEmitter;
var log2out = require('log2out');
var logger = log2out.getLogger('MonitorManager');

function MonitorManager() {
	this.monitors = [];
}

MonitorManager.prototype = Object.create(EventEmitter.prototype);

MonitorManager.prototype.start = function() {
	logger.info("start");
	var self = this;
	this.monitors.forEach(function (monitor) {
		monitor.connect();

		monitor.on('open', function () {
			logger.info("monitor open");
			if (self._allMonitorsOpened()) {
				logger.info("all opened");
				self.emit('open');
			}
		});

		monitor.on('close', function () {
			logger.info("monitor close");
			self.emit('close');
		});

		monitor.on('error', function () {
			logger.info("monitor error");
		});
	});
};

MonitorManager.prototype.add = function(monitor) {
	this.monitors.push(monitor);
};

MonitorManager.prototype._allMonitorsOpened = function () {
	var serviceOpen = 0,
		monitorsCount = this.monitors.length;
	this.monitors.forEach(function (monitor) {
		if (monitor.isOpen()) {
			serviceOpen++;
		}
	});
	return serviceOpen === monitorsCount;
};



module.exports = MonitorManager;
