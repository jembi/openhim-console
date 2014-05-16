'use strict';
/*jshint expr: true*/

describe('Service: Notify', function () {

  // load the service's module
  beforeEach(module('openhimWebui2App'));

  // instantiate service
  var Notify;
  beforeEach(inject(function (_Notify_) {
    Notify = _Notify_;
  }));

  it('should do something', function () {
    Notify.should.be.ok;
  });

});
