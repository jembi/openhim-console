'use strict';

describe('Service: Rest', function () {

  // load the service's module
  beforeEach(module('openhimWebui2App'));

  // instantiate service
  var Rest;
  beforeEach(inject(function (_Rest_) {
    Rest = _Rest_;
  }));

  it('should do something', function () {
    expect(!!Rest).toBe(true);
  });

});
