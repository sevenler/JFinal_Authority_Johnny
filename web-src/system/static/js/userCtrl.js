systemModule.controller('userCtrl', ['$scope','$rootScope','$stateParams','$window', 'api','D','jbase','NgTableParams',
 function($scope,$rootScope,$stateParams,$window,api,D,jbase,NgTableParams) {
   
   $rootScope.reset(function(){
      api.user.delete({id:$rootScope.delId},function(){
             $scope.tableParams.reload();
          });
   });
    
   $scope.tableParams = new NgTableParams({page: 1,  count: 10}, {
                  getData: function ($defer, params) {
                        api.user.list(params.$params,function(data){
                          $scope.list=data.data.list;
                          $defer.resolve($scope.list);
                     });   
                 }
               });

 

   $scope.edit=function(u){
         $window.location.href='#/system/user.edit?id='+u.id;
   } 

   $scope.freeze=function(u){
           api.user.freeze({id:u.id,status:u.status},function(){
                $scope.tableParams.reload();
           });
   }
 

 }]);


systemModule.controller('userEditCtrl', ['$scope','$rootScope','$stateParams','$window', 'api','D','jbase',
 function($scope,$rootScope,$stateParams,$window,api,D,jbase) {

    $scope.title='新增用户';
    $scope.modal=false;

    $scope.modalPwd=false;
    $scope.modalEmail =false;
    $scope.emailError=false;
    $scope.resend=true;
    $scope.time=60;

    $scope.f={icon:'/system/static/i/10.jpg' };

    api.role.list(function(data){
      $scope.roles=data;
    });

    if($stateParams.id){
        $scope.title='编辑用户';
        api.user.getUser({id:$stateParams.id},function(data){
            $scope.f=data.data;

            if($scope.f.role_ids) $scope.f.role_ids= parseInt($scope.f.role_ids);
            console.log($scope.f);
        })
    }

    $scope.setIcon=function(img){
        
        $scope.modal=false;
        $scope.f.icon='/system/static/i/'+img+".jpg";
    }

     $scope.submit=function(){

      var param = jbase.toParam('user',$scope.f,['role_ids']);
        
        api.user.save(param,function(data){
            
            if(data.code==200){
             if(!$scope.f.id)$scope.reSendEmail();
             else $window.location.href="#/system/user";
            }
        });
     }
      
     $scope.reSendEmail=function(email){
     	   var setTime =function(){
              if($scope.time>0){
                $scope.time--;
                jbase.delay(setTime,null,1000);
              } 
              else{
              	 $scope.time =null;
              	 $scope.resend=false;
              }
            };
         api.email.sendValEmail({email:email},function(data){
         	 $scope.resend=true;
           if(!email) $scope.modalEmail=true;
             $scope.time=60;
             setTime();
         });
         
     }  

     $scope.showModalPwd=function(){
         $scope.reSendEmail($scope.f.email);
         $scope.modalPwd=true;
     }


     $scope.modifyPwd=function(){

         $scope.valEmail(function(data){
              $scope.f.pwd = $scope.pwd;
              $scope.modalPwd=false;
         });
            
     }



     $scope.checkEmail=function(validity){
       if(!$scope.f.email)return ;    
       
      if ($(validity.field).is('.email')) {
        // 异步操作必须返回 Deferred 对象
        return $.ajax({
          url: '/system/email/existEmail?email='+$scope.f.email ,
          dataType: 'json'
        }).then(function(data) {
        	if(data.code==200)  validity.valid =true;
        	else  validity.valid =false;
          return validity;
        }, function() {
          validity.valid =false;
          return validity;
        });
      }

     }

     $scope.valEmail=function(func){
         api.email.valEmail({val:$scope.val},function(data){ 
         	  $scope.modalEmail=false;
         	   if(data.code==200) {
                if(!func)jbase.delay(function(){   $window.location.href="#/system/user";},null,555);
                 console.log(func);
                if(func)func(data);
                 $scope.val=null;
            }
         })

     }




 }]);



