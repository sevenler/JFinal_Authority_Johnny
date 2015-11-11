systemModule.controller('roleCtrl', ['$scope','$rootScope', '$filter' ,'api','jbase','NgTableParams',
 function($scope,$rootScope,$filter,api,jbase,NgTableParams) {
    
    $rootScope.reset(function(){
              api.role.delete({id:$rootScope.delId},function(){
                $scope.tableParams.reload();
                $rootScope.refresh();
              });
    });
   
    $scope.tableParams = new NgTableParams({page: 1,  count: 100}, {
                  getData: function ($defer, params) {
                      
                       api.role.list( function(data){
                       
                       data = $filter('orderBy')(data, 'seq');
                       $scope.list=data;
                       $defer.resolve($scope.list);
                     });   
                 }
               });

    $scope.edit=function(r){
          
          var role = jbase.find('id',r.id,$scope.list);
         
          delete role.res_names;
          $rootScope.system.role= role;

         $rootScope.go('#/system/role.edit?id='+r.id);
   }
 
   
 }]);


systemModule.controller('roleEditCtrl', ['$scope','$rootScope', '$filter' ,'api','jbase',
 function($scope,$rootScope,$filter,api,jbase) {
   $scope.f={};
   $scope.title='添加角色';
   $scope.ztree={}; 


    if($rootScope.$stateParams.id){
           $scope.f= $rootScope.system.role;
           $scope.readonly=true;
    }


    $scope.submit=function(){
       var checked =  $scope.ztree.getCheckedNodes(true);

       $scope.f.res_ids=jbase.toArray('id',checked).join(',');

       $scope.f.pname=null;

          api.role.save($scope.f,function(data){

                $rootScope.refresh();
                $rootScope.go('#/system/role');
          });
    }

    api.res.ztree(function(data){
         $scope.setting = {
            view: {   selectedMulti: false},
            check: { enable: true},
            data: { simpleData: { enable: true }},
         }; 
         
         if($scope.f.res_ids){
            var ids = $scope.f.res_ids.split(',');
            for(var i in data.data.ztree){
                   for(var j in ids){
                         if(data.data.ztree[i].id == ids[j] )data.data.ztree[i].checked=true;
                   }
            }
         }

        $scope.znodes= data.data.ztree;

    });


  
   


        


 
   
 }]);


