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