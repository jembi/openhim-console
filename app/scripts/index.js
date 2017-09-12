import "angular";
import "angular-cookies";
import "angular-resource";
import "angular-sanitize";
import "angular-route";
import "angular-ui-bootstrap";
import "angular-highlightjs";
import "angular-file-upload";
import "angular-bootstrap-colorpicker";
import "@kariudo/angular-fullscreen";

import { datetimepicker } from "./external/angular-bootstrap-datetimepicker-directive";
import { angularTaglist } from "./external/angular-taglist-directive";

import "bootstrap/dist/css/bootstrap.css";
import "morris.js/morris.css";
import "highlight.js/styles/default.css";
import "../styles/main.css";
import "highlight.js/styles/github.css";
import "eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css"
import "angular-bootstrap-colorpicker/css/colorpicker.css"

import * as controllers from "./controllers";
import * as directives from "./directives";

export const himConsole = angular
	.module('openhimConsoleApp', [
		'ngCookies',
		'ngResource',
		'ngSanitize',
		'ngRoute',
		'ui.bootstrap',
		'hljs',
		'angularFileUpload',
		'colorpicker.module',
		datetimepicker,
		angularTaglist,
		'FBAngular'
	]);

himConsole.run(function ($rootScope) {
	// register listener to watch route changes
	$rootScope.$on('$routeChangeStart', function () {
		// reset the alert object for each route changed
		$rootScope.alerts = {};
	});
})


//TODO: This needs to invert, the module should export and the controllers, should require it
export * from "./module";
import "./controllers";
import "./util";
import "./services";
import "./app";