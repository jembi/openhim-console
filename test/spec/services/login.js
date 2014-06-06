'use strict';

describe('Service: login', function () {

  // load the service's module
  beforeEach(module('openhimWebui2App'));

  // instantiate service
  var login;
  beforeEach(inject(function (_login_) {
    login = _login_;
  }));

  it('should do something', function () {
    expect(!!login).toBe(true);
  });

});
