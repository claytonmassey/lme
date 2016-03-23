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
