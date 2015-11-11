
systemModule.controller('loginCtrl', ['$scope','$rootScope', '$timeout', '$state',  'jbase','getMsg','api',
                                   function($scope,$rootScope,  $timeout, $state,  jbase ,getMsg,api) {
    $scope.remember=false;

    $scope.click =false;

    $rootScope.loadingTitle=getMsg(Code.LOGING);

    $scope.captchaUrl='/captcha';  
    
    $scope.changeCaptcha=function(){
      $scope.captchaUrl='/captcha?time='+new Date().getTime();
    }

     api.login.rsa(function(data){

      if(data.code==Code.LOGING){
          $scope.msg=getMsg(data.code);
          $rootScope.loading =true;
          
          jbase.delay(function(){ $rootScope.loading=false; },null, 555);
        } 
        else{
         if(data.data.email){
          $scope.email =data.data.email;
          $scope.remember=true;
         }

       	 $scope.exponent =data.data.exponent;
       	 $scope.modulus =data.data.modulus;
        }
    });

    $rootScope.loadClosed=function(){
      $state.go("main");
    }

    $scope.login=function( $event){

      if($event) $event.preventDefault();

      if(!$scope.email||!$scope.pwd||$scope.click)return;
        
       $scope.click=true;
       var data = "email=" + $scope.email + "&pwd=" + $scope.pwd;
       var k = jbase.rsa( $scope.exponent,$scope.modulus,data);

       api.login.login( {key:k,remember:$scope.remember,code:$scope.code},function(data){
          if(data.code==200)$state.go("main");
          else {
            $scope.click=false;
            $scope.msg= getMsg(data.code);
          
            if(data.code==Code.CAPTCHA_ERROR) {
               $scope.captcha=true;
            }

          }
       });

     };
   


}]);

 


