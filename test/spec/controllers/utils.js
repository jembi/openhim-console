'use strict'
/* global getHashAndSalt:false */
describe('Utils: getHashAndSalt', function () {
  it('should create a return a hash and salt', function () {
    var result = getHashAndSalt('string')
    result.should.have.property('hash')
    result.should.have.property('salt')
    result.should.have.property('algorithm')
  })
})
