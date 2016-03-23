(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./login.controller.js');
require('./register.controller.js');
},{"./login.controller.js":2,"./register.controller.js":3}],2:[function(require,module,exports){
angular
    .module('lavishMe')
    .controller('loginCtrl',  ['$auth', '$location', loginCtrl]);

function loginCtrl($auth, $location)  {
    var vm = this;

    vm.authenticate = function(provider) {
        if(provider === 'instagram') {
            alert('Not Implemented Yet');
            return;
        }
        else {
            $auth.authenticate(provider)
                .then(function(response) {
                    $location.path( "/myprofile" );
                })
                .catch(function(response) {
                    // show error message and keep on Login Page
                    alert('Something went wrong. TODO replace with error msg on the page.');
                });
        }
    };

    vm.login = function() {

        var user = {
            username: vm.username,
            password: vm.password
        };

        $auth.login(user)
            .then(function(response) {
                $location.path( "/myprofile" );
            })
            .catch(function(response) {
                alert('Something went wrong. TODO replace with error msg on the page.');
            });
    };

}
},{}],3:[function(require,module,exports){
angular
    .module('lavishMe')
    .controller('registerCtrl',  ['$auth', '$location', registerCtrl]);

function registerCtrl ($auth, $location) {
    var vm = this;
    vm.register = register;
    vm.genders = [{
        value: 'female',
        label: 'Female'
    }, {
        value: 'male',
        label: 'Male'
    }];

    function register() {

        // initial values
        vm.registrationError = '';

        var user = {
            email: vm.username,
            password: vm.password,
            gender: vm.genderSelect.value,
            lookingFor: vm.lookingForSelect.value
        };

        $auth.signup(user)
            .then(function(response) {
                $location.path( "/myprofile" );
            })
            .catch(function(response) {
                alert('Something went wrong. TODO replace with error msg on the page.');
            });

    }

}
},{}],4:[function(require,module,exports){
angular
    .module('lavishMe', ['ngRoute', 'mgcrea.ngStrap', 'satellizer']);

require('./config.js');
require('./common');
require('./profile');
require('./home');
require('./account');
},{"./account":1,"./common":7,"./config.js":9,"./home":11,"./profile":12}],5:[function(require,module,exports){
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




},{}],6:[function(require,module,exports){
angular
    .module('lavishMe')
    .directive('passwordConfirmation', passwordConfirmation);

function passwordConfirmation() {

    var directive = {
        require: 'ngModel',
        restrict: 'EA',
        scope: {
            otherModelValue: '=passwordConfirmation'
        },
        replace: true,
        bindToController: true,
        controller: PasswordConfirmationController,
        controllerAs: 'vm',
        link: PasswordConfirmationLink
    };

    return directive;

    function PasswordConfirmationController() {
        var vm = this;
    }

    function PasswordConfirmationLink(scope, element, attributes, ngModel) {
        console.log('password confirmation link');

        ngModel.$validators.compareTo = function(modelValue) {
            return modelValue === scope.vm.otherModelValue.$viewValue;
        };

        scope.$watch('vm.otherModelValue.$viewValue', function() {
            ngModel.$validate();
        });

    }
}

},{}],7:[function(require,module,exports){
require('./services/profile.service.js');
require('./directives/header.directive.js');
require('./directives/passwordConfirmation.directive.js');
},{"./directives/header.directive.js":5,"./directives/passwordConfirmation.directive.js":6,"./services/profile.service.js":8}],8:[function(require,module,exports){
angular
    .module('lavishMe')
    .service('profileData', ['$http', profileData]);


function profileData($http) {

    var myProfile = function () {
        var url = '/api/profile';
        return $http.get(url);
    };

    return {
        myProfile : myProfile
    };

}


},{}],9:[function(require,module,exports){
angular
    .module('lavishMe')
    .config(['$routeProvider', '$authProvider', config])
    .run(['$rootScope', '$location', '$route', '$auth', authCheck]);

function authCheck ($rootScope, $location, $route, $auth) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next.access.restricted && $auth.isAuthenticated() === false) {
            $location.path('/login');
            $route.reload();
        }
    });
}

function config ($routeProvider, $authProvider) {

    //Authentication configs
    $authProvider.facebook({
        clientId: '564016987133623',
        url: '/api/account/facebookcallback',
        redirectUri: window.location.origin + '/api/account/facebookcallback'
    });
    $authProvider.instagram({
        clientId: 'Instagram Client ID'
    });
    $authProvider.signupUrl = '/api/account/register';
    $authProvider.loginUrl = '/api/account/login';
    $authProvider.unlinkUrl = '/api/account/unlink/';

    //Routing
    $routeProvider
        .when('/', {
            templateUrl: 'home/home.view.html',
            controller: 'homeCtrl',
            controllerAs: 'vm',
            access: {restricted: false}
        })
        .when('/login', {
            templateUrl: 'account/login.view.html',
            controller: 'loginCtrl',
            controllerAs: 'vm',
            access: {restricted: false}
        })
        .when('/logout', {
            controller: 'logoutCtrl',
            controllerAs: 'vm',
            access: {restricted: true}
        })
        .when('/register', {
            templateUrl: 'account/register.view.html',
            controller: 'registerCtrl',
            controllerAs: 'vm',
            access: {restricted: false}
        })
        .when('/myprofile', {
            templateUrl: 'profile/myprofile.view.html',
            controller: 'myProfileCtrl',
            controllerAs: 'vm',
            access: {restricted: true}
        })
        .otherwise({redirectTo: '/'});
}
},{}],10:[function(require,module,exports){
angular
    .module('lavishMe')
    .controller('homeCtrl', [homeCtrl]);

function homeCtrl() {
    var vm = this;
}

},{}],11:[function(require,module,exports){
require('./home.controller.js');
},{"./home.controller.js":10}],12:[function(require,module,exports){
require('./myprofile.controller.js');
},{"./myprofile.controller.js":13}],13:[function(require,module,exports){
angular
    .module('lavishMe')
    .controller('myProfileCtrl', ['profileData', myProfileCtrl]);

function myProfileCtrl(profileData) {
    var vm = this;
    vm.profileModel = null;

    profileData.myProfile()
        .success(function(data) {
            vm.profileModel = data.user;
        })
        .error(function(e){
            console.log(e);
        });
}

},{}]},{},[4]);
