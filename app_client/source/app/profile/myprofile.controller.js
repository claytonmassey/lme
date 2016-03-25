angular
    .module('lavishMe')
    .controller('myProfileCtrl', ['profileData', myProfileCtrl]);

function myProfileCtrl(profileData) {
    var vm = this;
    vm.profileModel = null;
    vm.editorEnabled = false;
    vm.enableEditor = enableEditor;
    vm.cancelEditor = cancelEditor;
    vm.saveProfile = saveProfile;
    vm.genders = [{
        value: 'female',
        label: 'Female'
    }, {
        value: 'male',
        label: 'Male'
    }];

    profileData.myProfile()
        .success(function(data) {
            vm.profileModel = data.user;
        })
        .error(function(e){
            console.log(e);
        });

    function saveProfile() {
        vm.profileModel.firstname = vm.editableFirstName;
        vm.profileModel.lastname = vm.editableLastName;
        vm.profileModel.email = vm.editableEmail;
        vm.profileModel.oneliner = vm.editableOneliner;
        vm.profileModel.description = vm.editableDescription;
        vm.profileModel.gender = vm.editableGender.value;
        vm.profileModel.lookingFor = vm.editableLookingFor.value;
        vm.profileModel.age = vm.editableAge;

        profileData.saveProfile(vm.profileModel)
            .success(function(data){
                vm.profileModel = data.user;
                cancelEditor();
            });

    }

    function cancelEditor() {
        vm.editorEnabled = false;
    }

    function enableEditor() {
        vm.editorEnabled = true;
        vm.editableFirstName = vm.profileModel.firstname;
        vm.editableLastName = vm.profileModel.lastname;
        vm.editableEmail = vm.profileModel.email;
        vm.editableOneliner = vm.profileModel.oneliner;
        vm.editableDescription = vm.profileModel.description;
        vm.editableAge = vm.profileModel.age;

        vm.editableGender = {
            value: vm.profileModel.gender,
            label: vm.profileModel.gender
        };

        vm.editableLookingFor = {
            value: vm.profileModel.lookingFor,
            label: vm.profileModel.lookingFor
        };

    }
}
