define(['../module'], function (module) {

    function ContentsController($scope, $http) {

        $http.get('data/items.json').success(function (response) {
            $scope.items = response.items;
        });

    }

    module.component('contents', {
        templateUrl: module.path + '/contents/contents.html',
        controller: ContentsController
    });

});