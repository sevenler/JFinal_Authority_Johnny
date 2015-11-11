var duoshuoQuery = {short_name:"jayqqaa12"};

var systemModule = angular.module("systemModule", []);

var AdminApp = angular.module('AdminApp', ['ngAnimate','ngSanitize', 'ui.select','ngTable', 'jbaseModule','systemModule']);

/**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 */
AdminApp.run(["$rootScope", "$state", "$stateParams","$window",  function($rootScope, $state, $stateParams,$window) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$window =$window;
    //存放一些全局变量 以模块命名
    $rootScope.system={};
    $rootScope.app ={};
    $rootScope.push={};


    $rootScope.go=function(url){
      $window.location.href=url;
    }

    $rootScope.delete=function(id){
      $rootScope.confirm=true;
      $rootScope.delId= id;
    }

    //重置一些全局变量     
    $rootScope.reset=function(delFunc){
       $rootScope.ok=false;
       $rootScope.confirm=false;
       $rootScope.confirmBatch=false;
       $rootScope.okBatch=false;
      
       if($rootScope.okWatch) $rootScope.okWatch();

        $rootScope.okWatch= $rootScope.$watch('ok',function(value){
             if(value){
                $rootScope.ok=false;
                if(delFunc)delFunc();
              }
        });

    }

    $rootScope.hasPermission=function(url){

            
            if($rootScope.urls.indexOf(url)!=-1){
               if($rootScope.auth_urls.indexOf(url)!=-1)return true;
            }
            else return true;

          return false;
    };



  
   $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        
          if(error.status==404) $window.location.href="#/system/404";
          if(error.status==401) $window.location.href="/";
   });
}]);
 

AdminApp.config(['$translateProvider',  function($translateProvider ){

  $translateProvider.useStaticFilesLoader({
    prefix: '/system/static/i18n/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('zh_CH');

}]);


AdminApp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    
	$stateProvider
	.state( 'login', {
		url:'/login',
	    templateUrl : '/system/tpls/login.html',
	})
	.state('main', {
		url : "/:module/:name?id=",
		 views: { 
		  '':{ templateUrl : "/system/tpls/main.html"},

          'index@main':{ templateUrl : function(stateParams){
			 
			 window.scrollTo(0,0);
             
			 if(!stateParams.name)  stateParams.name ='index';
             if(!stateParams.module)  stateParams.module ='system';

          	 return  "/"+stateParams.module+"/tpls/"+stateParams.name+".html";
          }
      },
		},
	});

 

     $urlRouterProvider.otherwise("/login");
}]);

 


