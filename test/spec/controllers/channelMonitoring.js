'use strict'
/* global moment: false */

describe('Controller: ChannelMonitoringCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend

  function daysAgo (days) {
    return moment().subtract(days, 'days').startOf('day')
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    var channelsData = [{ completed: 2, completedWErrors: 0, failed: 3, processing: 0, successful: 16 }]

    var timeLoadData = [{ 'total': 34, 'avgResp': 2881.91, 'timestamp': daysAgo(6).format() },
      { 'total': 73, 'avgResp': 1313.57, 'timestamp': daysAgo(5).format() },
      { 'total': 17, 'avgResp': 3761.57, 'timestamp': daysAgo(4).format() },
      { 'total': 72, 'avgResp': 3545.57, 'timestamp': daysAgo(3).format() },
      { 'total': 45, 'avgResp': 1233.57, 'timestamp': daysAgo(2).format() },
      { 'total': 47, 'avgResp': 4564.57, 'timestamp': daysAgo(1).format() },
      { 'total': 4, 'avgResp': 3553.34, 'timestamp': daysAgo(0).format() }]

    $httpBackend.when('GET', new RegExp('.*/metrics/timeseries/hour/channels/5322fe9d8b6add4b2b059dd8')).respond([])
    $httpBackend.when('GET', new RegExp('.*/metrics/timeseries/day/channels/5322fe9d8b6add4b2b059dd8')).respond(timeLoadData)
    $httpBackend.when('GET', new RegExp('.*/metrics/channels/5322fe9d8b6add4b2b059dd8')).respond(channelsData)
    $httpBackend.when('GET', new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8')).respond({'_id': '5322fe9d8b6add4b2b059dd8', 'name': 'Sample JsonStub Channel 1', 'urlPattern': 'sample/api', 'allow': ['PoC'], 'routes': [{'host': 'jsonstub.com', 'port': 80, 'primary': true}]})

    createController = function () {
      scope = $rootScope.$new()
      return $controller('ChannelMonitoringCtrl', { $scope: scope, $routeParams: { channelId: '5322fe9d8b6add4b2b059dd8' } })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a single channel to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8'))
    createController()
    httpBackend.flush()
    scope.channel.name.should.equal('Sample JsonStub Channel 1')
  })

  it('should run updateMetrics() and set the channelsDonutData graph object', function () {
    createController()
    scope.selectedDateType.from = daysAgo(6).toDate()
    scope.selectedDateType.until = daysAgo(0).toDate()
    scope.selectedDateType.type = 'day'
    scope.selectedDateType.period = 'custom'
    scope.updateMetrics()
    httpBackend.flush()

    scope.channelsDonutData.should.have.property('data')
    scope.channelsDonutData.data.length.should.equal(3)
    scope.channelsDonutData.should.have.property('colors')
    scope.channelsDonutData.colors.length.should.equal(3)
    scope.channelsDonutData.data[0].should.have.property('label', 'Failed')
    scope.channelsDonutData.data[0].should.have.property('value', '14.29')
    scope.channelsDonutData.data[1].should.have.property('label', 'Completed')
    scope.channelsDonutData.data[1].should.have.property('value', '9.52')
    scope.channelsDonutData.data[2].should.have.property('label', 'Successful')
    scope.channelsDonutData.data[2].should.have.property('value', '76.19')

    scope.channelsBarData.should.have.property('data')
    scope.channelsBarData.data.length.should.equal(3)
    scope.channelsBarData.should.have.property('xkey', 'label')
    scope.channelsBarData.should.have.property('ykeys')
    scope.channelsBarData.ykeys[0].should.equal('value')
    scope.channelsBarData.should.have.property('labels')
    scope.channelsBarData.labels[0].should.equal('Total')
    scope.channelsBarData.data[0].should.have.property('label', 'Failed')
    scope.channelsBarData.data[0].should.have.property('value', 3)
    scope.channelsBarData.data[1].should.have.property('label', 'Completed')
    scope.channelsBarData.data[1].should.have.property('value', 2)
    scope.channelsBarData.data[2].should.have.property('label', 'Successful')
    scope.channelsBarData.data[2].should.have.property('value', 16)

    scope.channel.name.should.equal('Sample JsonStub Channel 1')
  })

  it('should run updateMetrics() and set the transactionLoadData graph object', function () {
    createController()
    scope.selectedDateType.from = daysAgo(6).toDate()
    scope.selectedDateType.until = daysAgo(0).toDate()
    scope.selectedDateType.type = 'day'
    scope.selectedDateType.period = 'custom'
    scope.updateMetrics()
    httpBackend.flush()

    scope.transactionLoadData.should.have.property('data')
    scope.transactionLoadData.data.length.should.equal(7)
    scope.transactionLoadData.should.have.property('xkey', 'timestamp')
    scope.transactionLoadData.should.have.property('ykeys')
    scope.transactionLoadData.ykeys[0].should.equal('value')
    scope.transactionLoadData.should.have.property('labels')
    scope.transactionLoadData.labels[0].should.equal('Transactions')

    scope.transactionLoadData.data[0].should.have.property('timestamp')
    scope.transactionLoadData.data[0].should.have.property('value', 34)
    scope.transactionLoadData.data[1].should.have.property('timestamp')
    scope.transactionLoadData.data[1].should.have.property('value', 73)
    scope.transactionLoadData.data[2].should.have.property('timestamp')
    scope.transactionLoadData.data[2].should.have.property('value', 17)
    scope.transactionLoadData.data[3].should.have.property('timestamp')
    scope.transactionLoadData.data[3].should.have.property('value', 72)
    scope.transactionLoadData.data[4].should.have.property('timestamp')
    scope.transactionLoadData.data[4].should.have.property('value', 45)
    scope.transactionLoadData.data[5].should.have.property('timestamp')
    scope.transactionLoadData.data[5].should.have.property('value', 47)
    scope.transactionLoadData.data[6].should.have.property('timestamp')
    scope.transactionLoadData.data[6].should.have.property('value', 4)

    scope.channel.name.should.equal('Sample JsonStub Channel 1')
  })

  it('should run updateMetrics() and set the transactionTimeData graph object', function () {
    httpBackend.expectGET(new RegExp('.*/metrics/channels/5322fe9d8b6add4b2b059dd8'))
    createController()
    scope.selectedDateType.from = daysAgo(6).toDate()
    scope.selectedDateType.until = daysAgo(0).toDate()
    scope.selectedDateType.type = 'day'
    scope.selectedDateType.period = 'custom'
    scope.updateMetrics()
    httpBackend.flush()

    scope.transactionResponseTimeData.should.have.property('data')
    scope.transactionResponseTimeData.data.length.should.equal(7)
    scope.transactionResponseTimeData.should.have.property('xkey', 'timestamp')
    scope.transactionResponseTimeData.should.have.property('ykeys')
    scope.transactionResponseTimeData.ykeys[0].should.equal('value')
    scope.transactionResponseTimeData.should.have.property('labels')
    scope.transactionResponseTimeData.labels[0].should.equal('Response Time (ms)')

    scope.transactionResponseTimeData.data[0].should.have.property('timestamp')
    scope.transactionResponseTimeData.data[0].should.have.property('value', '2881.91')
    scope.transactionResponseTimeData.data[1].should.have.property('timestamp')
    scope.transactionResponseTimeData.data[1].should.have.property('value', '1313.57')
    scope.transactionResponseTimeData.data[2].should.have.property('timestamp')
    scope.transactionResponseTimeData.data[2].should.have.property('value', '3761.57')
    scope.transactionResponseTimeData.data[3].should.have.property('timestamp')
    scope.transactionResponseTimeData.data[3].should.have.property('value', '3545.57')
    scope.transactionResponseTimeData.data[4].should.have.property('timestamp')
    scope.transactionResponseTimeData.data[4].should.have.property('value', '1233.57')
    scope.transactionResponseTimeData.data[5].should.have.property('timestamp')
    scope.transactionResponseTimeData.data[5].should.have.property('value', '4564.57')
    scope.transactionResponseTimeData.data[6].should.have.property('timestamp')
    scope.transactionResponseTimeData.data[6].should.have.property('value', '3553.34')

    scope.channel.name.should.equal('Sample JsonStub Channel 1')
  })
})
