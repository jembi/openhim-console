'use strict';
/*jshint expr: true*/

describe('Service: Api', function () {

  // load the service's module
  beforeEach(module('openhimWebui2App'));

  // instantiate service
  var Api;
  beforeEach(inject(function (_Api_) {
    Api = _Api_;
  }));

  it('should define an Api service', function () {
    Api.should.be.ok;
  });

});
