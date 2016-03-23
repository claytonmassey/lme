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

