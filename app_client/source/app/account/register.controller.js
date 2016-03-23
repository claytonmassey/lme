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