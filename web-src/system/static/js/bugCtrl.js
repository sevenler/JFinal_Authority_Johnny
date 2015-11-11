
systemModule.controller('bugCtrl', ['$scope','$rootScope', 'jbase','getMsg','api','NgTableParams',
                                   function($scope,$rootScope,   jbase ,getMsg,api,NgTableParams) {
      
    $scope.f={};

    $rootScope.reset(function(){

             api.bug.delete({id:$rootScope.delId},function(){
               $scope.tableParams.reload();
             });
         });
              
    $scope.tableParams = new NgTableParams({page: 1,  count: 10,sortOrder:'desc',sortName:'date'}, {
                  getData: function ($defer, params) {
                       api.bug.list(params.$params, function(data){
                          $scope.list= data.data.list; 
                          params.total(data.data.total);
                          $defer.resolve($scope.list);
                     });   
                 }
               });

    

    $scope.edit=function(r){

        $scope.f=r;
       $scope.editor.setValue(r.des);

    }


    $scope.save=function(){
        
      $scope.f.des= $scope.editor.getValue();

       api.bug.save($scope.f,function(){
              $scope.tableParams.reload();
              $scope.clean();
       });

    
    }


    
    $scope.clean=function(){

        $scope.f={};
        $scope.editor.setValue('');

    }
 



}]);

 


