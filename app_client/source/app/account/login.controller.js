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