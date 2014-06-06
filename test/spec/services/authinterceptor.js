'use strict';

describe('Service: Authinterceptor', function () {

  // load the service's module
  beforeEach(module('openhimWebui2App'));

  // instantiate service
  var Authinterceptor;
  beforeEach(inject(function (_Authinterceptor_) {
    Authinterceptor = _Authinterceptor_;
  }));

  it('should do something', function () {
    expect(!!Authinterceptor).toBe(true);
  });

});
