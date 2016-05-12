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

var BusToHttp = require('eyeos-BusToHttp');
var log2out = require('log2out');

function BusToExpressServer(serverSettings) {
	this.expressSettings = serverSettings.httpServer;
	this.amqpSettings = serverSettings.amqpServer;
	this.busToHttps = [];
	this.logger = log2out.getLogger('BusToExpressServer');
	this.busToHttpConnectionReady = false;
}

BusToExpressServer.prototype.start = function() {
	this.logger.info("Start express");
	this.expressServer = this.expressSettings.app.listen(this.expressSettings.port, this.expressSettings.host);
	if (!this.busToHttpConnectionReady) {
		this.logger.info("Start httpToBus");
		this.amqpSettings.queues.forEach(this._startHttpBusConnection.bind(this));
		this.busToHttpConnectionReady = true;
	}
};

BusToExpressServer.prototype._startHttpBusConnection = function (queue) {
	var httpHost = this.expressSettings.host;
	var httpPort = this.expressSettings.port;
	var httpToBusOptions = {
		busHost: this.amqpSettings.host,
		busPort: this.amqpSettings.port,
		queueName: queue
	};
	var busToHttp = new BusToHttp();
	this.logger.info('Starting BusToHttp instance for HTTP: %s:%d and AMQP: %j', httpHost, httpPort, httpToBusOptions);
	busToHttp.start(httpToBusOptions, httpHost, httpPort,  function () {

	});
	this.busToHttps.push(busToHttp);
};

BusToExpressServer.prototype.stop = function () {
	this.logger.info("Stopping express server. Bus still opened and consuming/rejecting messages");
	/**
	 * FIXME:
	 * When stopping the service this should unsubscribe from the amqp. If not we will be
	 * consumming and rejecting messages non stop.
	 */
	this.expressServer.close();
};

module.exports = BusToExpressServer;