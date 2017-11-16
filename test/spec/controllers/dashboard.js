'use strict'
/* global moment: false */

describe('Controller: DashboardCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, timeLoadDataHours, timeLoadDataDays

  function hoursAgo (hours) {
    return moment().subtract(hours, 'hours').startOf('hour')
  }

  function daysAgo (days) {
    return moment().subtract(days, 'days').startOf('day')
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    timeLoadDataHours = [{ 'total': 21, 'avgResp': 43269.95, 'timestamp': hoursAgo(4).format() },
      { 'total': 65, 'avgResp': 13367.98, 'timestamp': hoursAgo(3).format() },
      { 'total': 32, 'avgResp': 11249.94, 'timestamp': hoursAgo(2).format() },
      { 'total': 13, 'avgResp': 54668.97, 'timestamp': hoursAgo(1).format() },
      { 'total': 56, 'avgResp': 34769.91, 'timestamp': hoursAgo(0).format() }]

    timeLoadDataDays = [{ 'total': 21, 'avgResp': 43269.95, 'timestamp': daysAgo(4).format() },
      { 'total': 65, 'avgResp': 13367.98, 'timestamp': daysAgo(3).format() },
      { 'total': 32, 'avgResp': 11249.94, 'timestamp': daysAgo(2).format() },
      { 'total': 13, 'avgResp': 54668.97, 'timestamp': daysAgo(1).format() },
      { 'total': 56, 'avgResp': 34769.91, 'timestamp': daysAgo(0).format() }]

    var channelsData = [{ '_id': { 'channelID': '53884f881fdb6f2d69e29cff' }, 'failed': 10, 'successful': 58, 'processing': 0, 'completed': 20, 'completedWErrors': 2 },
      { '_id': { 'channelID': '12344f881faa6f2d69e29cee' }, 'failed': 8, 'successful': 43, 'processing': 2, 'completed': 4, 'completedWErrors': 4 },
      { '_id': { 'channelID': '53884f881fdb6f2d35353cdd' }, 'failed': 16, 'successful': 26, 'processing': 0, 'completed': 8, 'completedWErrors': 5 }]

    $httpBackend.when('GET', new RegExp('.*/metrics/timeseries/hour')).respond(timeLoadDataHours)
    $httpBackend.when('GET', new RegExp('.*/metrics/channels.*')).respond(channelsData)
    $httpBackend.when('GET', new RegExp('.*/channels')).respond([{'_id': '5322fe9d8b6add4b2b059dd8', 'name': 'Sample JsonStub Channel 1', 'urlPattern': 'sample/api', 'allow': ['PoC'], 'routes': [{'host': 'jsonstub.com', 'port': 80, 'primary': true}]}])

    createController = function () {
      scope = $rootScope.$new()
      return $controller('DashboardCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should run updateMetrics() and create transactionLoadData scope object (default: hours)', function () {
    createController()
    scope.selectedDateType.from = hoursAgo(4).toDate()
    scope.selectedDateType.until = hoursAgo(0).toDate()
    scope.selectedDateType.type = 'hour'
    scope.selectedDateType.period = 'custom'
    scope.updateMetrics()
    httpBackend.flush()

    scope.transactionLoadData.should.have.property('xkey', 'timestamp')
    scope.transactionLoadData.should.have.property('ykeys')
    scope.transactionLoadData.ykeys.length.should.equal(1)
    scope.transactionLoadData.ykeys[0].should.equal('value')
    scope.transactionLoadData.should.have.property('labels')
    scope.transactionLoadData.labels.length.should.equal(1)
    scope.transactionLoadData.labels[0].should.equal('Transactions')

    scope.transactionLoadData.data.length.should.equal(5)

    scope.transactionLoadData.data[0].should.have.property('timestamp', hoursAgo(4).format('YYYY-MM-DD HH:mm'))
    scope.transactionLoadData.data[0].should.have.property('value', 21)
    scope.transactionLoadData.data[1].should.have.property('timestamp', hoursAgo(3).format('YYYY-MM-DD HH:mm'))
    scope.transactionLoadData.data[1].should.have.property('value', 65)
    scope.transactionLoadData.data[2].should.have.property('timestamp', hoursAgo(2).format('YYYY-MM-DD HH:mm'))
    scope.transactionLoadData.data[2].should.have.property('value', 32)
    scope.transactionLoadData.data[3].should.have.property('timestamp', hoursAgo(1).format('YYYY-MM-DD HH:mm'))
    scope.transactionLoadData.data[3].should.have.property('value', 13)
    scope.transactionLoadData.data[4].should.have.property('timestamp', hoursAgo(0).format('YYYY-MM-DD HH:mm'))
    scope.transactionLoadData.data[4].should.have.property('value', 56)
  })

  it('should run updateMetrics() and create transactionResponseTimeData scope object (default: hours)', function () {
    createController()
    scope.selectedDateType.from = hoursAgo(4).toDate()
    scope.selectedDateType.until = hoursAgo(0).toDate()
    scope.selectedDateType.type = 'hour'
    scope.selectedDateType.period = 'custom'
    scope.updateMetrics()
    httpBackend.flush()

    scope.transactionResponseTimeData.should.have.property('xkey', 'timestamp')
    scope.transactionResponseTimeData.should.have.property('ykeys')
    scope.transactionResponseTimeData.ykeys.length.should.equal(1)
    scope.transactionResponseTimeData.ykeys[0].should.equal('value')
    scope.transactionResponseTimeData.should.have.property('labels')
    scope.transactionResponseTimeData.labels.length.should.equal(1)
    scope.transactionResponseTimeData.labels[0].should.equal('Response Time (ms)')

    scope.transactionResponseTimeData.data.length.should.equal(5)

    scope.transactionResponseTimeData.data[0].should.have.property('timestamp', hoursAgo(4).format('YYYY-MM-DD HH:mm'))
    scope.transactionResponseTimeData.data[0].should.have.property('value', '43269.95')
    scope.transactionResponseTimeData.data[1].should.have.property('timestamp', hoursAgo(3).format('YYYY-MM-DD HH:mm'))
    scope.transactionResponseTimeData.data[1].should.have.property('value', '13367.98')
    scope.transactionResponseTimeData.data[2].should.have.property('timestamp', hoursAgo(2).format('YYYY-MM-DD HH:mm'))
    scope.transactionResponseTimeData.data[2].should.have.property('value', '11249.94')
    scope.transactionResponseTimeData.data[3].should.have.property('timestamp', hoursAgo(1).format('YYYY-MM-DD HH:mm'))
    scope.transactionResponseTimeData.data[3].should.have.property('value', '54668.97')
    scope.transactionResponseTimeData.data[4].should.have.property('timestamp', hoursAgo(0).format('YYYY-MM-DD HH:mm'))
    scope.transactionResponseTimeData.data[4].should.have.property('value', '34769.91')
  })

  it('should run updateMetrics() and create transactionLoadData scope object (days)', function () {
    httpBackend.expectGET(new RegExp('.*/metrics/timeseries/day')).respond(timeLoadDataDays)
    createController()
    scope.selectedDateType.from = daysAgo(4).toDate()
    scope.selectedDateType.until = daysAgo(0).toDate()
    scope.selectedDateType.type = 'day'
    scope.selectedDateType.period = 'custom'
    scope.updateMetrics()
    httpBackend.flush()

    scope.transactionLoadData.should.have.property('xkey', 'timestamp')
    scope.transactionLoadData.should.have.property('ykeys')
    scope.transactionLoadData.ykeys.length.should.equal(1)
    scope.transactionLoadData.ykeys[0].should.equal('value')
    scope.transactionLoadData.should.have.property('labels')
    scope.transactionLoadData.labels.length.should.equal(1)
    scope.transactionLoadData.labels[0].should.equal('Transactions')

    scope.transactionLoadData.data.length.should.equal(5) // 5 days of data

    scope.transactionLoadData.data[0].should.have.property('timestamp', daysAgo(4).format('YYYY-MM-DD HH:mm'))
    scope.transactionLoadData.data[0].should.have.property('value', 21)
    scope.transactionLoadData.data[1].should.have.property('timestamp', daysAgo(3).format('YYYY-MM-DD HH:mm'))
    scope.transactionLoadData.data[1].should.have.property('value', 65)
    scope.transactionLoadData.data[2].should.have.property('timestamp', daysAgo(2).format('YYYY-MM-DD HH:mm'))
    scope.transactionLoadData.data[2].should.have.property('value', 32)
    scope.transactionLoadData.data[3].should.have.property('timestamp', daysAgo(1).format('YYYY-MM-DD HH:mm'))
    scope.transactionLoadData.data[3].should.have.property('value', 13)
    scope.transactionLoadData.data[4].should.have.property('timestamp', daysAgo(0).format('YYYY-MM-DD HH:mm'))
    scope.transactionLoadData.data[4].should.have.property('value', 56)
  })

  it('should run updateMetrics() and create transactionResponseTimeData scope object (days)', function () {
    httpBackend.expectGET(new RegExp('.*/metrics/timeseries/day')).respond(timeLoadDataDays)
    createController()
    scope.selectedDateType.from = daysAgo(4).toDate()
    scope.selectedDateType.until = daysAgo(0).toDate()
    scope.selectedDateType.type = 'day'
    scope.selectedDateType.period = 'custom'
    scope.updateMetrics()
    httpBackend.flush()

    scope.transactionResponseTimeData.should.have.property('xkey', 'timestamp')
    scope.transactionResponseTimeData.should.have.property('ykeys')
    scope.transactionResponseTimeData.ykeys.length.should.equal(1)
    scope.transactionResponseTimeData.ykeys[0].should.equal('value')
    scope.transactionResponseTimeData.should.have.property('labels')
    scope.transactionResponseTimeData.labels.length.should.equal(1)
    scope.transactionResponseTimeData.labels[0].should.equal('Response Time (ms)')

    scope.transactionResponseTimeData.data.length.should.equal(5) // 5 days of data

    scope.transactionResponseTimeData.data[0].should.have.property('timestamp', daysAgo(4).format('YYYY-MM-DD HH:mm'))
    scope.transactionResponseTimeData.data[0].should.have.property('value', '43269.95')
    scope.transactionResponseTimeData.data[1].should.have.property('timestamp', daysAgo(3).format('YYYY-MM-DD HH:mm'))
    scope.transactionResponseTimeData.data[1].should.have.property('value', '13367.98')
    scope.transactionResponseTimeData.data[2].should.have.property('timestamp', daysAgo(2).format('YYYY-MM-DD HH:mm'))
    scope.transactionResponseTimeData.data[2].should.have.property('value', '11249.94')
    scope.transactionResponseTimeData.data[3].should.have.property('timestamp', daysAgo(1).format('YYYY-MM-DD HH:mm'))
    scope.transactionResponseTimeData.data[3].should.have.property('value', '54668.97')
    scope.transactionResponseTimeData.data[4].should.have.property('timestamp', daysAgo(0).format('YYYY-MM-DD HH:mm'))
    scope.transactionResponseTimeData.data[4].should.have.property('value', '34769.91')
  })

  it('should run updateMetrics() and create channelsData scope object', function () {
    createController()
    scope.selectedDateType.from = hoursAgo(4).toDate()
    scope.selectedDateType.until = hoursAgo(0).toDate()
    scope.selectedDateType.type = 'hour'
    scope.selectedDateType.period = 'custom'
    scope.updateMetrics()
    httpBackend.flush()

    scope.channelsData.should.have.property('data')
    scope.channelsData.data.length.should.equal(3)
    scope.channelsData.should.have.property('xkey', 'channel')
    scope.channelsData.should.have.property('colors')
    scope.channelsData.colors.length.should.equal(5)
    scope.channelsData.should.have.property('ykeys')
    scope.channelsData.ykeys.length.should.equal(5)
    scope.channelsData.should.have.property('labels')
    scope.channelsData.labels.length.should.equal(5)

    scope.channelsData.data[0].failed.should.equal(10)
    scope.channelsData.data[0].completed.should.equal(20)
    scope.channelsData.data[0].completedWErrors.should.equal(2)
    scope.channelsData.data[0].successful.should.equal(58)
    scope.channelsData.data[0].processing.should.equal(0)

    scope.channelsData.data[1].failed.should.equal(8)
    scope.channelsData.data[1].completed.should.equal(4)
    scope.channelsData.data[1].completedWErrors.should.equal(4)
    scope.channelsData.data[1].successful.should.equal(43)
    scope.channelsData.data[1].processing.should.equal(2)

    scope.channelsData.data[2].failed.should.equal(16)
    scope.channelsData.data[2].completed.should.equal(8)
    scope.channelsData.data[2].completedWErrors.should.equal(5)
    scope.channelsData.data[2].successful.should.equal(26)
    scope.channelsData.data[2].processing.should.equal(0)
  })
})
