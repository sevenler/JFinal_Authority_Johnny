
/**
fis 3 配置
**/

// 加 md5




// fis.match('*.{js,css,png}', {
//   useHash: true
// });

fis.match('*.jade', {
  parser: fis.plugin('jade'),
  rExt: '.html'
});



// // 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
})

 // 对 CSS 进行图片合并
fis.match('*.css', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});

  // fis-optimizer-uglify-js 插件进行压缩，已内置
fis.match('*.js', {
  optimizer: fis.plugin('uglify-js')
});

   // fis-optimizer-clean-css 插件进行压缩，已内置
fis.match('*.css', {
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});



fis.match('::package', {
  packager: fis.plugin('map', {
     'system/static/js/lib.js':[
     // '/lib/jquery/jquery.min.js',
     // '/lib/angular/angular.min.js',
     // '/lib/angular-ui-router/angular-ui-router.min.js',
     // '/lib/ui-utils/ui-utils.min.js',
     '/lib/amazeui/amazeui.min.js',
     '/lib/angular-animate/angular-animate.min.js',
     '/lib/angular-cookies/angular-cookies.min.js',
     '/lib/angular-sanitize/angular-sanitize.min.js',
     '/lib/angular-translate/angular-translate.min.js',
     '/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
     '/lib/ui-select/select.js',
     '/lib/ng-table/ng-table.js',
     '/lib/fancybox/jquery.fancybox.js',
     '/lib/rsa.js',
     '/lib/jbase.js',
      '/lib/data.js',
      '/lib/ztree/jquery.ztree.all-3.5.min.js',
      '/lib/simditor/module.js',
      '/lib/simditor/uploader.js',
       '/lib/simditor/hotkeys.js',
       '/lib/simditor/simditor.js',

     ] ,
     'system/static/js/system.js': ['/system/static/js/**.js'],
     'system/static/css/lib.css': [ 
     '/lib/bootstrap/bootstrap.css',
     '/lib/ng-table/ng-table.css',
     '/lib/amazeui/amazeui.css',
    '/system/static/css/**.css', 
    '/lib/ui-select/select.css',
     '/lib/ztree/css/metroStyle/metroStyle.css',
     '/lib/simditor/simditor.css',
    ] 
    })
})




fis.match('*', {
  deploy: fis.plugin('local-deliver', {
    to: '../jfinal-authority/src/main/webapp'
  })
})


