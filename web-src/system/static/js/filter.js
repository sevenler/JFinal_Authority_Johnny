
systemModule.filter("optionType", function() {
    var filterfun = function(type) {
     
       if(type==1)return '访问';
       if(type==2)return '登录';
       if(type==3)return '保存';
       if(type==5)return '删除';

   
    };


    return filterfun;
});​



systemModule.filter("userStatus", function() {
    var filterfun = function(type) {
     
       if(type==1)return '正常';
       if(type==2)return '冻结';

   
    };


    return filterfun;
});​
