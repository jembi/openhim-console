'use strict';
/* jshint expr: true */
/* global sinon:false */

describe('Service: Notify', function () {

  // load the service's module
  beforeEach(module('openhimWebui2App'));

  // instantiate service
  var Notify;
  var rootScope;
  beforeEach(inject(function (_Notify_, $rootScope) {
    Notify = _Notify_;
    rootScope = $rootScope;
    sinon.spy(rootScope, '$broadcast');
  }));

  it('should broadcast an event', function () {
    Notify.should.be.ok;
    Notify.notify('testEvent');
    rootScope.$broadcast.should.have.been.calledWith('testEvent');
  });

});
