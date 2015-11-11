
systemModule.controller('logCtrl', ['$scope','$rootScope', 'jbase','getMsg','api','NgTableParams',
                                   function($scope,$rootScope,   jbase ,getMsg,api,NgTableParams) {
    
     
    $scope.chart=false;

              
    $scope.tableParams = new NgTableParams({page: 1,  count: 10,sortOrder:'desc',sortName:'date'}, {
                  getData: function ($defer, params) {
                       api.log.list(params.$params, function(data){
                          $scope.list= data.data.list; 
                          params.total(data.data.total);
                          $defer.resolve($scope.list);
                     });   
                 }
               });

    

    $scope.showChart=function(){
         $scope.chart = !$scope.chart;
           api.log.chart(function(option){
                var myChart = echarts.init(document.getElementById('main'));
                myChart.setOption(option);
           });
    }

   

    $scope.setDate=function(){

        $scope.tableParams.$params.dateStart =$scope.dateStart; 
        $scope.tableParams.$params.dateEnd =$scope.dateEnd; 


        console.log('setdate');

    }
  



 


}]);

 


