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
