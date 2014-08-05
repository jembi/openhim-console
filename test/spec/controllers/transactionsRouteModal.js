'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: TransactionsRouteModalCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, modalInstance, route;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {

    createController = function() {
      route = {
        'name': 'second',
        '_id': '53df5d525b6d133c7de9eb56',
        'response': {
          'status': 301,
          'body': 'this is dummy body content',
          'timestamp': '2014-08-04T10:15:46.007Z',
        },
        'request': {
          'path': '/',
          'querystring': '',
          'method': 'GET'
        }
      };

      scope = $rootScope.$new();
      modalInstance = sinon.spy();
      return $controller('TransactionsRouteModalCtrl', { $scope: scope, $modalInstance: modalInstance, route: route } );
    };

  }));

  it('should attach a single route object to the scope', function () {
    createController();

    scope.route.name.should.equal('second');
    scope.route.response.status.should.equal(301);
    scope.route.request.method.should.equal('GET');
  });

});