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

var sinon = require('sinon');
var assert = require('chai').assert;
var ServiceFacade = require('../lib/serviceFacade');
var ServiceManager = require('../lib/serviceManager');
var MonitorManager = require('../lib/monitorManager');

suite("ServiceFacade Suite", function () {
    var sut;
	var serverManager, monitorManager;

	function createServer () {
		return {
			start: function() {},
			stop: function () {}
		}
	}

	function createMonitor () {
		return {
			opened: false,
			isOpen: function () {
				return this.opened;
			}
		};
	}

    setup(function () {
		serverManager = new ServiceManager();
		monitorManager = new MonitorManager();
        sut = new ServiceFacade(serverManager, monitorManager);
    });

	suite('#addServer', function () {
		test("should add a server to the serviceManager", function() {
			var serverManagerAddStub = sinon.stub(serverManager, 'add');
			var server = createServer();
			sut.addServer(server);
			sinon.assert.calledWithExactly(serverManagerAddStub, server);
		});
	});

	suite('#addMonitor', function () {
		test("should add a monitor", function() {
			var monitorManagerAddStub = sinon.stub(monitorManager, 'add');
			var monitor = createMonitor();
			sut.addMonitor(monitor);
			sinon.assert.calledWithExactly(monitorManagerAddStub, monitor);
		});
	});

	suite('#start', function () {
		test('should start the monitorManager', function () {
			var monitorManagerStub = sinon.stub(monitorManager, 'start');
			sut.start();
			sinon.assert.calledWithExactly(monitorManagerStub);
		});

		['open', 'close'].forEach(function (action) {
			test("adds " + action + " listener", function () {
				var monitorManagerStub = sinon.stub(monitorManager, 'on');
				sut.start();
				sinon.assert.calledWithExactly(monitorManagerStub, action, sinon.match.func);
			});
		});
	});

	[
		{ serverManagerMethod: 'start', eventEmitted: 'open' },
		{ serverManagerMethod: 'stop', eventEmitted: 'close' }
	].forEach(function (data) {
		suite('#start on monitor ' + data.eventEmitted, function () {
			test("should " + data.serverManagerMethod + " serviceManager", function () {
				var serviceManagerStub = sinon.stub(serverManager, data.serverManagerMethod);
				sut.start();
				monitorManager.emit(data.eventEmitted);
				sinon.assert.calledWithExactly(serviceManagerStub);
			});
		});

	});
});
