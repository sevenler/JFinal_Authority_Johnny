
// 200 以内的表示 状态 不提示错误

Code={
 
 LOADING:101,
 LOGING:102, 
 

 
 NULL:404,

 ERROR:500,
 
 RELOGIN:1001,
 USER_NOT_EXIT:1003,
 USER_PWD_ERROR:1004,
 USER_FRRZE:1005,
 USER_ATTEMPT:1006,
 USER_AUTH:1007,

  EMAIL_VAL_ERROR:1100,
  EMAIL_EXIT:1101,

  CAPTCHA_ERROR:1200,
  
  FILE_TYPE_ERROR:11000,
  IMG_SIZE_ERROR:12000,
  APK_ERROR:13000,
  PUSH_ERROR:9000,
}

systemModule.factory('getMsg',[function() {

  var get=function(code,type){

   if(code==Code.LOADING) return '正在加载...';
   if(code==Code.ERROR) return '服务器错误';
   if(code==403) return '没有操作权限 请联系管理员';

     if(code==Code.USER_NOT_EXIT) return'用户不存在';
     if(code==Code.USER_PWD_ERROR) return '用户名或密码错误';
     if(code==Code.USER_FRRZE) return '用户被封了';
     if(code==Code.USER_ATTEMPT)return'密码错误次数太多,请一小时后再试';
     if(code==Code.USER_AUTH)return '没有权限';
     if(code==Code.LOGING)return '已经登录过正在自动登录...';

    if(code==Code.EMAIL_VAL_ERROR) return '邮箱验证错误';
    if(code==Code.EMAIL_EXIT) return '邮箱已经存在了';
    if(code==Code.IMG_SIZE_ERROR) return '图片大小错误';
    if(code==Code.APK_ERROR) return 'apk解析错误请重新上传';
    if(code==Code.FILE_TYPE_ERROR) return '文件上传类型错误';
    if(code==Code.CAPTCHA_ERROR)return'验证码错误';
     
    if(code==Code.PUSH_ERROR) return '推送设置错误请检查';
   

 }
 return get;
}]);


systemModule.factory('api',['$rootScope','jbase', 'getMsg', function($rootScope,jbase,getMsg) {

 var api= {
   
   post: function(url,data,func){
        
      layer.load();

       jbase.post(url,data,function(d){
  
             if(d.code ==500)$rootScope.error =true;
             else if(d.code>200) { 
                $rootScope.warn=true;
                 layer.msg(getMsg(d.code));
              }
             if(func) func(d);
          
           layer.closeAll('loading');
       })

   },

   upload:function(e,$scope,url,func,end){

        if(e.target.files.length>0&&e.target.files[0].name.indexOf(end)==-1){
            layer.msg(getMsg(Code.FILE_TYPE_ERROR));
            return;
        }
        
        jbase.upload(e,$scope,url,function(d){
               if(d.code ==500)$rootScope.error =true;
               else if(d.code>200) { 
                $rootScope.warn=true;
                 layer.msg(getMsg(d.code));
              }
             if(func) func(d);
        });
        
   },

  login:{
    logout:function(func){
      api.post('/logout',null,func);
    },
    login: function(data,func){
     api.post('/login',data,func);
   },
   rsa:function(func){
    api.post('/rsa',null,func);
  }
},
res:{
 
 urls:function(func){
   api.post('/system/res/urls',null,func);
 },
 ztree:function(func){
   api.post('/system/res/ztree',null,func);
 },
 tree:function(data,func){
   api.post('/system/res/tree',data,func);
 },
 list:function(data,func){
   api.post('/system/res/list',data,func);
 },
 save:function(data,func){
   api.post('/system/res/save',data,func);
 },
  delete:function(data,func){
   api.post('/system/res/delete',data,func);
 },
  batchDelete:function(data,func){
   api.post('/system/res/batchDelete',data,func);
  },

},
role:{
  list:function(func){
    api.post('/system/role/list',null,func);
  },
  save:function(data,func){
     var param = jbase.toParam('role',data,['res_ids']);
     api.post('/system/role/save',param,func);
  },

  delete:function(data,func){
     api.post('/system/role/delete',data,func);
  },
},
user:{
 freeze:function(data,func){
   api.post('/system/user/freeze',data,func);
 },
 list:function(data,func){
   api.post('/system/user/list',data,func);
 },
 save:function(data,func){
   api.post('/system/user/save',data,func);
 },
  delete:function(data,func){
   api.post('/system/user/delete',data,func);
 },


 getUser:function(data,func){
   api.post('/system/user/getUser',data,func);
 }

},
email:{
 sendValEmail:function(data,func){
  api.post('/system/email/sendValEmail',data,func);
 },

  valEmail:function(data,func){
  api.post('/system/email/valEmail',data,func);
 },
  existEmail:function(data,func){
  api.post('/system/email/existEmail',data,func);
 },
},

log:{

  list:function(data,func){
    api.post('/system/log/list',data,func);
  },
  browser:function(func){
    api.post('/system/log/browser',null,func);
  },
  data:function(func){
    api.post('/system/log/data',null,func);
  },
  error:function(func){
    api.post('/system/log/error',null,func);
  },
  chart:function(func){
      
    api.post('/system/log/chart',null,func);

  }

},

bug:{
 
  list:function(data,func){
    api.post('/system/bug/list',data,func);
  },
  save:function(data,func){
      var param = jbase.toParam('bug',data);
    api.post('/system/bug/save',param,func);
  },
  delete:function(data,func){
    api.post('/system/bug/delete',data,func);
  },
  status:function(data,func){
    api.post('/system/bug/status',data,func);
  },

},



};

return api;
}]);

systemModule.factory('D',['$rootScope',  function($rootScope) {

 var d= {
  icons:[
  {name:'am-icon-at'},
  {name:'am-icon-bell-slash'},
  {name:'am-icon-bell-slash-o'},
  {name:'am-icon-bicycle'},
  {name:'am-icon-binoculars'},
  {name:'am-icon-birthday-cake'},
  {name:'am-icon-futbol-o'},
  {name:'am-icon-google-wallet'},
  {name:'am-icon-ils'},
  {name:'am-icon-ioxhost'},
  {name:'am-icon-lastfm'},
  {name:'am-icon-lastfm-square'},
  {name:'am-icon-line-chart'},
  {name:'am-icon-meanpath'},
  {name:'am-icon-newspaper-o'},
  {name:'am-icon-paint-brush'},
  {name:'am-icon-paypal'},
  {name:'am-icon-pie-chart'},
  {name:'am-icon-yelp'},
  {name:'am-icon-anchor'},
  {name:'am-icon-archive'},
  {name:'am-icon-area-chart'},
  {name:'am-icon-arrows'},
  {name:'am-icon-arrows-h'},
  {name:'am-icon-arrows-v'},
  {name:'am-icon-asterisk'},
  {name:'am-icon-at'},
  {name:'am-icon-automobile'},
  {name:'am-icon-ban'},
  {name:'am-icon-bank'},
  {name:'am-icon-bar-chart'},
  {name:'am-icon-bar-chart-o'},
  {name:'am-icon-barcode'},
  {name:'am-icon-bookmark'},
  {name:'am-icon-bookmark-o'},
  {name:'am-icon-briefcase'},
  {name:'am-icon-bug'},
  {name:'am-icon-building'},
  {name:'am-icon-building-o'},
  {name:'am-icon-bullhorn'},
  {name:'am-icon-bullseye'},
  {name:'am-icon-bus'},
  {name:'am-icon-cab'},
  {name:'am-icon-calculator'},
  {name:'am-icon-calendar'},
  {name:'am-icon-calendar-o'},
  {name:'am-icon-cc'},
  {name:'am-icon-certificate'},
  {name:'am-icon-check'},
  {name:'am-icon-check-circle'},
  {name:'am-icon-check-circle-o'},
  {name:'am-icon-check-square'},
  {name:'am-icon-check-square-o'},
  {name:'am-icon-child'},
  {name:'am-icon-circle'},
  {name:'am-icon-circle-o'},
  {name:'am-icon-circle-o-notch'},
  {name:'am-icon-circle-thin'},
  {name:'am-icon-clock-o'},
  {name:'am-icon-close'},
  {name:'am-icon-cloud'},
  {name:'am-icon-compass'},
  {name:'am-icon-copyright'},
  {name:'am-icon-credit-card'},
  {name:'am-icon-crop'},
  {name:'am-icon-crosshairs'},
  {name:'am-icon-cube'},
  {name:'am-icon-cubes'},
  {name:'am-icon-cutlery'},
  {name:'am-icon-dashboard'},
  {name:'am-icon-database'},
  {name:'am-icon-desktop'},
  {name:'am-icon-dot-circle-o'},
  {name:'am-icon-download'},
  {name:'am-icon-edit'},
  {name:'am-icon-ellipsis-h'},
  {name:'am-icon-ellipsis-v'},
  {name:'am-icon-envelope'},
  {name:'am-icon-exclamation'},
  {name:'am-icon-exclamation-circle'},
  {name:'am-icon-exclamation-triangle'},
  {name:'am-icon-external-link'},
  {name:'am-icon-external-link-square'},
  {name:'am-icon-eye'},
  {name:'am-icon-eye-slash'},
  {name:'am-icon-eyedropper'},
  {name:'am-icon-fax'},
  {name:'am-icon-female'},
  {name:'am-icon-fighter-jet'},
  {name:'am-icon-file-archive-o'},
  {name:'am-icon-file-audio-o'},
  {name:'am-icon-file-code-o'},
  {name:'am-icon-file-excel-o'},
  {name:'am-icon-file-image-o'},
  {name:'am-icon-fire'},
  {name:'am-icon-fire-extinguisher'},
  {name:'am-icon-flag'},
  {name:'am-icon-flag-checkered'},
  {name:'am-icon-flag-o'},
  {name:'am-icon-flash'},
  {name:'am-icon-flask'},
  {name:'am-icon-folder'},
  {name:'am-icon-folder-o'},
  {name:'am-icon-folder-open'},
  {name:'am-icon-home'},
  {name:'am-icon-eur'},
  {name:'am-icon-euro'},
  {name:'am-icon-gbp'},
  {name:'am-icon-ils'},
  {name:'am-icon-inr'},
  {name:'am-icon-jpy'},
  {name:'am-icon-krw'},
  {name:'am-icon-money'},
  {name:'am-icon-file-text-o'},
  {name:'am-icon-files-o'},
  {name:'am-icon-floppy-o'},
  {name:'am-icon-font'},
  {name:'am-icon-header'},
  {name:'am-icon-indent'},
  {name:'am-icon-italic'},
  {name:'am-icon-link'},
  {name:'am-icon-list'},
  {name:'am-icon-list-alt'},
  {name:'am-icon-list-ol'},
  {name:'am-icon-user-md'},
  {name:'am-icon-wheelchair'}]
  };

return d;
}]);




