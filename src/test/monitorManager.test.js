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
var MonitorManager = require('../lib/monitorManager');
var MongoMonitor = require('../lib/mongoMonitor');

suite("MonitorManager Suite", function () {
    var sut;

	function generateMonitor () {
		return new MongoMonitor();
	}

    setup(function () {
        sut = new MonitorManager();
    });

	suite('#start', function () {

		function prepareMonitors (count) {
			var monitor = generateMonitor();
			var monitorOnStub = sinon.stub(monitor, 'on');
			var monitorConnectStub = sinon.stub(monitor, 'connect');
			for (var i = 0; i < count; i++) {
				sut.add(monitor);
			}
			return {
				monitorOnStub: monitorOnStub,
				monitorConnectStub: monitorConnectStub
			};
		}

		test('should connect all monitors', function () {
			var monitors = 5;
			var monitorStub = prepareMonitors(monitors).monitorConnectStub;
			sut.start();
			sinon.assert.callCount(monitorStub, monitors);

		});

		var actions = ['open', 'close', 'error'];
		actions.forEach(function (action) {
			test("adds " + action + " listener to all the monitors", function() {
				var monitors = 1;
				var monitorStub = prepareMonitors(monitors).monitorOnStub;
				sut.start();
				sinon.assert.calledWithExactly(monitorStub, action, sinon.match.func);
			});
		});

		test("adds correct amount of listeners to all the monitors", function() {
			var monitors = 5;
			var monitorStub = prepareMonitors(monitors).monitorOnStub;
			sut.start();
			sinon.assert.callCount(monitorStub, actions.length * monitors);
		});

	});

	['close'].forEach(function (action) {
		suite('#start on monitor ' + action, function () {
			test("emits close event", function () {
				var monitor = generateMonitor();
				sinon.stub(monitor, 'connect');
				var called = false;
				sut.add(monitor);
				sut.start();
				sut.on('close', function () {
					called = true;
				});

				monitor.emit(action);
				assert.isTrue(called, "The close event is never emitted");
			});
		});
	});

	suite('#start on monitor open', function () {
		var action = 'open';

		function createOkMonitor () {
			var monitor = generateMonitor();
			sinon.stub(monitor, 'connect');
			sinon.stub(monitor, 'isOpen').returns(true);
			return monitor;
		}

		function createKoMonitor () {
			var monitor = generateMonitor();
			sinon.stub(monitor, 'connect');
			return monitor;
		}

		test('emits open event when all monitors are opened', function () {
			var monitor = createOkMonitor();
			var called = false;
			sut.add(monitor);
			sut.start();
			sut.on('open', function () {
				called = true;
			});

			monitor.emit(action);
			assert.isTrue(called, "The close event is never emitted");
		});

		test('does not emit open event when not all monitors are opened', function () {
			var called = false;
			var monitor = createKoMonitor();
			sut.add(monitor);
			sut.start();
			sut.on('open', function () {
				called = true;
			});

			monitor.emit(action);
			assert.isFalse(called, "The close event is emitted");
		});
	});


});
