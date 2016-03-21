define(['./module'], function (module) {

    "use strict";

    module.controller('MainController', function ($scope) {

        var version = require('angular').version.full;

        $scope.title = "Angular " + version + " ready!";
        $scope.app = {
          logo: "images/ng-small.png"
        };

        this.title = 'Angular Skeleton Application';

    });
});