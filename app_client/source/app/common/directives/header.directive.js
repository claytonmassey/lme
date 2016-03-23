angular
    .module('lavishMe')
    .directive('header', ['$auth', '$location', headerDirective]);

function headerDirective($auth, $location) {

    var directive = {
        restrict: 'EA',
        replace: true,
        bindToController: true,
        templateUrl: "common/directives/header.view.html",
        controller: ['$scope', '$auth', '$location', HeaderController],
        controllerAs: 'vm'
    };

    return directive;

    function HeaderController($scope, $auth, $location) {
        var vm = this;

        vm.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        vm.logout = function() {
            $auth.logout();
            $location.path( "/login" );
        };

    }
}



