
systemModule.controller('mainCtrl', ['$scope','$rootScope', '$state','$timeout','jbase','getMsg', 'api',
                                   function($scope,$rootScope, $state,$timeout,jbase,getMsg,api ) {

      $rootScope.loadingTitle=getMsg(Code.LOADING);

      $rootScope.refresh= function(){

       api.res.tree(null,function(data){
            $rootScope.tree = data.data.tree;
       });


       api.res.urls(function(data){
            $rootScope.urls= data.data.urls;
            $rootScope.auth_urls=data.data.auth_urls;

       });


    } 
    
    $rootScope.loadClosed=function(){}

     jbase.AJAX_FAIL_CALLBACK=function(data,code){
        
        if(code==401) $state.go("login");  // 401 这里定义为没有登录
        else if(code==403)  layer.msg(getMsg(code));// 403 表示登录了也没有的权限
        else $rootScope.error =true;
       
       console.log("fail callback ");
        layer.closeAll('loading');
     }

    if(!$rootScope.user){

      api.login.rsa(function(data){
       if(data.code!=Code.LOGING) $state.go("login");
         $rootScope.user=data.data.user;
      });

         $rootScope.refresh();
    }

     $scope.logout=function(){
      
         api.login.logout(function(data){
             $state.go('login');
             $rootScope.user=null;
         });
     }

  


}]);