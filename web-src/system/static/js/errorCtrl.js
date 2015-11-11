
systemModule.controller('errorCtrl', ['$scope','$rootScope', 'jbase','getMsg','api',
                                   function($scope,$rootScope,   jbase ,getMsg,api) {
    
    api.log.error(function(data){
         $scope.log=data;
    });


}]);

 


