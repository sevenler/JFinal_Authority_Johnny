systemModule.controller('resCtrl', ['$scope','$rootScope','$stateParams','$window', 'api','D','jbase','$filter','NgTableParams',
 function($scope,$rootScope,$stateParams,$window,api,D,jbase,$filter,NgTableParams) {


   if($stateParams.id) $scope.showBack=true;

   $scope.icons = D.icons;
   $scope.f={};

   $rootScope.reset(function(){
             api.res.delete({id:$scope.delId},function(){
               $scope.getList({id:$stateParams.id});
               $rootScope.refresh();
             });
   });

   $scope.tableParams = new NgTableParams({page: 1,  count: 100}, {
                  counts: [], // hide page counts control
                  getData: function ($defer, params) {
                   $defer.resolve($scope.list);
                 }
               });

   $scope.getList=function(d){
     api.res.list(d,function(data){
      $scope.list=data.data.list;
      $scope.parent =data.data.parent;
      $scope.tableParams.reload();

    });                             
   }


  $scope.getList({id:$stateParams.id});

   $scope.go=function(id){
    $window.location.href="#/system/res?id="+id;
  }

  $scope.back=function(){ 
     $window.history.back();
   }



 $scope.post=function(){ 

   $scope.f.iconCls= $scope.f.icon.name;
   $scope.f.icon=null;
   var param = jbase.toParam('res',$scope.f,['childSize']);

   api.res.save(param,function(d){
     $scope.showModal=false;
     $scope.getList({id:$stateParams.id});
     $rootScope.refresh();
   })
 }

 $scope.edit=function(id){
  $scope.f= jbase.find('id',id,$scope.list);
  $scope.f.icon={name:$scope.f.iconCls};
  $scope.title='编辑';
  $scope.showModal=true;

}

$scope.add=function(){ 

  $scope.f={ seq:10,type:1,icon:{name:'am-icon-folder'}};
  if($scope.parent)$scope.f.pid=$scope.parent.id;

  $scope.showModal=true;
  $scope.title='添加';
}

$scope.delete=function(id){

  $rootScope.confirm=true;
  $scope.delId= id;

}

$scope.batchDelete =function(){

 var ids = [];
 angular.forEach($scope.checkboxes.items,function(k,v){
  if(k) ids.push(v);
});
 if(ids.length==0)return;

 $rootScope.confirmBatch=true;
 $rootScope.$watch('okBatch',function(value){
   if(value){
     api.res.batchDelete({ids:ids.join(",")},function(){
      $scope.getList({id:$stateParams.id});
      $rootScope.refresh();
    });
   }
 });
}

        //FIXME  TO  DIRECTIVE
        $scope.checkboxes = { 'checked': false, items: {} };

        // watch for check all checkbox
        $scope.$watch('checkboxes.checked', function(value) {
          angular.forEach($scope.list, function(item) {
            if (angular.isDefined(item.id)) {
              $scope.checkboxes.items[item.id] = value;
            }
          });
        });

        $scope.$watch('checkboxes.items', function(values) {
          if (!$scope.list) {
            return;
          }
          var checked = 0, unchecked = 0,
          total = $scope.list.length;
          angular.forEach($scope.list, function(item) {
            checked   +=  ($scope.checkboxes.items[item.id]) || 0;
            unchecked += (!$scope.checkboxes.items[item.id]) || 0;
          });
          if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
          }
            // grayed checkbox
            angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
          }, true);


      }]);


