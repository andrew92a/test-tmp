
/**
 * List of all Application dependencies and height-level angular modules
 */
define([
    'angular',
    './modules/main/index'

//  './modules/other/index' <-- inject modules here

], function (angular) {

    var ng = angular;

    ng.module('app', ['app.main']);

    ng.module('other', []);

    return ng;
});