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
var ServiceManager = require('../lib/serviceManager');

suite("ServiceManager Suite", function () {
    var sut;

	function createServer () {
		return {
			start: sinon.stub(),
			stop:sinon.stub()
		}
	}

    setup(function () {
        sut = new ServiceManager();
    });

	['start', 'stop'].forEach(function (action) {
		suite('#' + action, function () {
			test("should " + action + " all servers", function() {
				var servers = 5;
				var server = createServer();

				for (var i = 0; i < servers; i++) {
					sut.add(server);
				}
				sut[action]();
				sinon.assert.callCount(server[action], servers);
			});
		});
	});

});
