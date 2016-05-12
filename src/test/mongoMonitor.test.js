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
var EventEmitter = require('events').EventEmitter;
var MongoMonitor = require('../lib/mongoMonitor');
var MongoConnection = require('../lib/mongoConnection');

suite('MongoMonitor', function(){
	var sut;
	var mongoConn, mongoConnectionConnect;
	var conn;
	var host, port, db;

	setup(function(){
		host = 'fake host';
		port = 'fake port';
		db = 'fake db';
		conn = new EventEmitter();
		mongoConn = new MongoConnection(host, port, db);
		mongoConnectionConnect = sinon.stub(mongoConn, 'connect').returns(conn);
		sut = new MongoMonitor(host, port, db, mongoConn);
	});

	suite('#connect', function(){
		test('should call to mongoConnection.connect', function(){
			sut.connect();
			assert.isTrue(mongoConnectionConnect.called);
		});

		[
			{emitName: 'open', connectionEmit: 'connected', opened: true},
			{emitName: 'close', connectionEmit: 'close', opened: false},
			{emitName: 'error', connectionEmit: 'error', opened: false}
		].forEach(function (item) {
			testConnection(item.emitName, item.connectionEmit, item.opened);
		});

		function testConnection (emitName, connectionEmit, opened) {
			test('should emit ' + emitName + ' when connection is ' + connectionEmit, function (done) {
				sut.on(emitName, function () {
					done();
				});
				sut.connect();
				conn.emit(connectionEmit);
			});
			test('should set isOpen = '+ opened +' when connection is' + connectionEmit, function () {
				sut.on(emitName, function () {});
				sut.connect();
				conn.emit('connected');
				conn.emit(connectionEmit);
				assert.equal(sut.isOpen(), opened);
			});
		}
	});
});
