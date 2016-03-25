angular
    .module('lavishMe')
    .service('profileData', ['$http', profileData]);


function profileData($http) {

    var myProfile = function () {
        var url = '/api/profile';
        return $http.get(url);
    };

    var saveProfile = function (profileModel) {
        var url = '/api/profile';
        return $http.post(url, profileModel);
    };

    return {
        myProfile : myProfile,
        saveProfile: saveProfile
    };

}

