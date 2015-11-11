
systemModule.controller('indexCtrl', ['$scope','$rootScope', 'jbase','getMsg','api',
                                   function($scope,$rootScope,   jbase ,getMsg,api) {


    
     api.log.browser(function(data){
          $scope.browser=data.data;
     });

    api.log.data(function(data){
         $scope.data=data.data;
    });
 

}]);

 


