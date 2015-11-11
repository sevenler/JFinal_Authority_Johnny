 

/**
 * 让$http post 不发送json格式
 */
var jbaseModule = angular.module("jbaseModule",['ui.router','ui.utils','pascalprecht.translate','ngCookies','ui.uploader'], ["$httpProvider", function($httpProvider) {
	  // Use x-www-form-urlencoded Content-Type
	  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	  /**
	   * The workhorse; converts an object to x-www-form-urlencoded serialization.
	   * @param {Object} obj
	   * @return {String}
	   */ 
	  var param = function(obj) {
	    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
	      
	    for(name in obj) {
	      value = obj[name];
	        
	      if(value instanceof Array) {
	        for(i=0; i<value.length; ++i) {
	          subValue = value[i];
	          fullSubName = name + '[' + i + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value instanceof Object) {
	        for(subName in value) {
	          subValue = value[subName];
	          fullSubName = name + '[' + subName + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value !== undefined && value !== null)
	        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	    }
	      
	    return query.length ? query.substr(0, query.length - 1) : query;
	  };

	  // Override $http service's default transformRequest
	  $httpProvider.defaults.transformRequest = [function(data) {
	    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	  }];
}]);



jbaseModule.factory('jbase',['$http','$rootScope','$timeout', 'uiUploader', function($http,$rootScope,$timeout,uiUploader) {
 
  var jbase= {
    AJAX_FAIL_CALLBACK:null,
    post:function(url,data,sucfun){
         $.AMUI.progress.start(); 
        $http.post(url,data).success(function(data){
          $.AMUI.progress.done(); 
           if(sucfun) sucfun(data);
      }).error(function(data,code){
          $.AMUI.progress.done(); 
       if(jbase.AJAX_FAIL_CALLBACK) jbase.AJAX_FAIL_CALLBACK(data,code);
      });
    },
    
    upload:function(e,$scope,url,func){
            uiUploader.addFiles(e.target.files);
            uiUploader.startUpload({
                url:url,
                onProgress:function(file){
                },
                onCompleted: function(file,d) {
                     d = eval('(' + d + ')');
                      if(func){
                            $scope.$apply(function(){
                                   func(d);
                            });
                      }
                }
            });
    },

    rsa: function(k1,k2,data){  //need rsa.js

     	 var k = RSAUtils.getKeyPair(  k1,'', k2);
	   	 return RSAUtils.encryptedString(k, data);

      
    },
    find:function(k,v,list){
       var result ;
       angular.forEach(list, function(item) {

             if(item[k]== v){
                result= jbase.clone(item);
                delete result['$$hashKey'];
                return ;
             }
        });

       return result ;
    },
    toArray:function(k,list) { //从数组中遍历当个属性 组成数组
         
         var arry =[];
       angular.forEach(list,function(item){
            if(item[k]) arry.push(item[k]);
       });
   
     return arry;
    },
    clone:function(myObj){ 
       if(typeof(myObj) != 'object') return myObj; 
       if(myObj == null) return myObj; 
       var myNewObj = new Object(); 
       for(var i in myObj) 
       myNewObj[i] = jbase.clone(myObj[i]); 
        delete myNewObj['$$hashKey']
       return myNewObj; 
     } ,
    toParam:function(modelName,param ,out ){
      
       var p  = jbase.clone(param);
       for(var k in p){  
           if(out&& out.indexOf(k)!=-1) continue ;
  
           p[modelName+'.'+k] = p[k];

          delete p[k];
        }  
      return p;
    },
    delay:function(f1,f2,delay){
          
          $timeout(function(){
             if(f1)f1();
          $timeout(function(){
              if(f2)f2();
             },delay);
          },delay);

    },
  }
  
  return jbase;
}]);


/* jbase  amaze Directive  must import amazeUI */


jbaseModule.directive("amValidator", ['$parse', function($parse, $scope)     {
    return {
       restrict:"A",
       scope:{
        validate:'&',
       },
       link: function(scope, element, attrs) {
 

     element.validator({
      
        validate: function(v){
            if(scope.validate) {
              return  scope.validate({v:v});
            }
        },
     });  
       
 
        }
    } 
}]);

jbaseModule.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                return _.map(changeEvent.target.files, function(file){
                  scope.fileread = [];
                  var reader = new FileReader();
                  reader.onload = function (loadEvent) {
                      scope.$apply(function () {
                          scope.fileread.push(loadEvent.target.result);
                      });
                  }
                  reader.readAsDataURL(file);
                });
            });
        }
    }
}]);



jbaseModule.directive("amValidatorTooltip", ['$parse', function($parse, $scope)     {
    return {
       restrict:"A",
       scope:{
        validate:'&',
       },
       link: function(scope, element, attrs) {

     var $tooltip = $('<div id="vld-tooltip"></div>');
     $tooltip.appendTo(document.body);

     element.validator({

        validate: function(v){
            if(scope.validate) {
                $tooltip.hide();
              return  scope.validate({v:v});
            }
        },
     });

     var validator = element.data('amui.validator');

   element.on('focusin focusout', '.am-form-error input', function(e) {
     if (e.type === 'focusin') {
        var $this = $(this);
        var offset = $this.offset();
        var msg = $this.data('foolishMsg') || validator.getValidationMessage($this.data('validity'));

        $tooltip.text(msg).show().css({
          left: offset.left + 10,
          top: offset.top + $(this).outerHeight() + 10
       });
       } else {
        $tooltip.hide();
      }
  });

        }
    } 
}]);


jbaseModule.directive("amDropdown", function() {
    return {
       restrict:"A",
       link: function(scope, element, attrs) {
            var p = element.parent();
       	   element.dropdown({justify: p});
        }
    } 
});



jbaseModule.directive("amFullscreen", ["$document",function($document) {
    return {
       restrict:"A",
       link: function(scope, element, attrs) {
              element.on('click', function() {
                $.AMUI.fullscreen.toggle();
              });
              var text =  element.children('[am-fullscreen-text]');
              $document.on($.AMUI.fullscreen.raw.fullscreenchange, function() {
                $.AMUI.fullscreen.isFullscreen ? text.text('关闭全屏') : text.text('开启全屏');
              });


        }
    } 
}]);

 

jbaseModule.directive("amLoading", function() {
    return {
    	restrict:"AE",
      scope:{
        title:'=',
        show:'=',
        closed:'&'
      },
       link: function(scope, element, attrs) {

          element.on('closed.modal.amui', function(){
              scope.$apply(function(){
                  if(scope.closed) scope.closed();
               });
          });

          scope.$watch('show',function(newValue){
            
            if(scope.show==true){
                element.modal({closeViaDimmer:0});
            } 
            else if(scope.show==false) {
              element.modal('close');
            }
          });
      },
    	template:'<div class="am-modal am-modal-loading am-modal-no-btn" tabindex="-1"  >
    	<div class="am-modal-dialog"> <div class="am-modal-hd">{{title}}</div> <div class="am-modal-bd">
    	 <span class="am-icon-spinner am-icon-spin"></span></div></div></div>',
    	replace:true
    } 
});

 


jbaseModule.directive("amAlert", function() {
    return {
    	restrict:"AE",
    	scope : {
			title : '@',
			content:'@',
      show: '='
		},
    replace:true,
    transclude : true,
    link: function(scope, element, attrs) {
         
          element.on('close.modal.amui', function(){
               scope.$apply(function(){
                 scope.show=false;
               });
          });
         
          scope.$watch('show',function(newValue){
              
            if(scope.show==true){
              element.modal('open');
            }
              
          });
     },
    	template:
    '<div class="am-modal am-modal-alert" tabindex="-1" >
      <div class="am-modal-dialog">
        <div class="am-modal-hd">{{title}}</div>
        <div class="am-modal-bd">{{content}} </div>
        <div class="am-modal-footer">
          <span class="am-modal-btn">确定</span>
        </div>
      </div>
    </div>'
    } 
});

 


jbaseModule.directive("amModal", function() {
    return {
      restrict:"A",
      scope:{
        show:'=',
      },
       link: function(scope, element, attrs) {

          element.on('closed.modal.amui', function(){
               scope.$apply(function(){
                   if(scope.show) scope.show=false;
               });
          });
 
          scope.$watch('show',function(newValue){
            if(scope.show==true){
                element.modal({closeViaDimmer:0});
            }else if(scope.show==false) {
              element.modal('close');
            } 
            
          });
      }
    } 
});



jbaseModule.directive("amPopover", function() {
    return {
      restrict:"A",
      scope:{
        show:'=',
        content:'@',
        trigger:'@',
      },
       link: function(scope, element, attrs) {
           
          scope.$watch('show',function(newValue){
            if(scope.show==true){
            element.popover({ content: scope.content,trigger:scope.trigger});
            }else if(scope.show==false) {
                 element.eq(0).removeData('amui.popover');
            } 
            
          });
      }
    } 
});

jbaseModule.directive("amConfirm", function() {
    return {
      restrict:"AE",
      scope : {
      title : '@',
      content:'@',
      show: '=',
      ok:'=',
    },
    replace:true,
    transclude : true,
    link: function(scope, element, attrs) {
         
          element.on('closed.modal.amui', function(){
               scope.$apply(function(){
                 scope.show=false;
               });  
          });
          scope.$watch('show',function(newValue){
             
             if(scope.show==true){
               element.modal({
               relatedTarget: this,
               onConfirm: function(){
                      if(typeof(scope.ok)!='undefined' ) scope.ok=true;
               }});
             }
          });
     },
      template:
    '<div class="am-modal am-modal-confirm" tabindex="-1"  >
       <div class="am-modal-dialog">
        <div class="am-modal-hd">{{title}}</div>
        <div class="am-modal-bd"> {{content}} </div>
        <div class="am-modal-footer">
        <span class="am-modal-btn" data-am-modal-cancel>取消</span>
        <span class="am-modal-btn" data-am-modal-confirm>确定</span>
       </div>
      </div>
    </div>'
    } 
});



jbaseModule.directive("formFile", function() {
    return {
      restrict:"A",
       link: function(scope, element, attrs) {
            
      element.on('change', function() {
        var fileNames = '';
        $.each(this.files, function() {
          fileNames += ' <span class="am-badge">' + this.name + '</span>  ';
        });
         element.next().html(fileNames);
      });
      }
    } 
});
 

jbaseModule.directive("fancybox", function() {
    return {
      restrict:"A",
       link: function(scope, element, attrs) {
            
            element.fancybox();
      }
    } 
});



jbaseModule.directive("simditor", function() {
    return {
      restrict:"A",
      scope:{
        editor:'='
      },
       link: function(scope, element, attrs) {
          scope.editor = new Simditor({
           textarea:  element
         });
      }
      }
});

 
jbaseModule.directive("duoshuo", function() {
    return {
      restrict:"A",
       link: function(scope, element, attrs) {

            var el = document.createElement('div'); 
         el.setAttribute('data-thread-key', 'jbase');//必选参数
         el.setAttribute('data-url', 'http://127.0.0.1/');//必选参数
         DUOSHUO.EmbedThread(el);
         element.append(el);

            
      }
    } 
});


jbaseModule.directive('ztree',function(){

   return {
    restrict:'A',
    scope:{
      setting:'=',
      znodes:'=',
      obj:'=',
    },
    link:function(scope,element){

        scope.$watch('znodes',function(newVal){
           console.log('init ztree');

           if(scope.setting&&scope.znodes) scope.obj= $.fn.zTree.init( element, scope.setting, scope.znodes);
        });
  
    }
   }
});

 
jbaseModule.directive('amDatepicker',function(){

   return {
    restrict:'A',
    scope:{
        data:'='
      },
    link:function(scope,element){

  
      element.datepicker().on('changeDate.datepicker.amui',function(event) {
                $(this).datepicker('close');
              scope.$apply(function(){
                scope.data=element.data('date');
             });


         });
      }
   }

});
