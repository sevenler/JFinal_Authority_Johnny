package com.jayqqaa12;

import com.alibaba.druid.filter.stat.StatFilter;
import com.alibaba.druid.wall.WallFilter;
import com.jayqqaa12.jbase.jfinal.ext.xss.ACAOlHandler;
import com.jayqqaa12.jbase.jfinal.ext.xss.XssHandler;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.ext.handler.ContextPathHandler;
import com.jfinal.ext.interceptor.SessionInViewInterceptor;
import com.jfinal.ext.plugin.config.ConfigKit;
import com.jfinal.ext.plugin.config.ConfigPlugin;
import com.jfinal.ext.plugin.shiro.ShiroInterceptor;
import com.jfinal.ext.plugin.shiro.ShiroPlugin;
import com.jfinal.ext.plugin.sqlinxml.SqlInXmlPlugin;
import com.jfinal.ext.plugin.tablebind.AutoTableBindPlugin;
import com.jfinal.ext.route.AutoBindRoutes;
import com.jfinal.plugin.activerecord.SqlReporter;
import com.jfinal.plugin.druid.DruidPlugin;
import com.jfinal.plugin.druid.DruidStatViewHandler;
import com.jfinal.plugin.ehcache.EhCachePlugin;

/**
 * API引导式配置
 */
public class MyConfig extends JFinalConfig {

	private Routes routes;
	private boolean isDev = isDevMode();

	private static boolean isDevMode() {
		String osName = System.getProperty("os.name");
		return osName.indexOf("Windows") != -1;
	}

	static {
//		if (isDevMode()) System.setProperty("LOGDIR", "c:/");
//		else System.setProperty("LOGDIR", "/log");// linux
		System.setProperty("LOGDIR", "/Users/Johnny/temp");
	}

	/**
	 * 配置常量
	 */
	public void configConstant(Constants me) {
		new ConfigPlugin(".*.txt").reload(false).start();

		me.setDevMode(isDev);
	}

	/**
	 *
	 *
	 * 配置路由
	 */
	public void configRoute(Routes me) {
		this.routes = me;
		// 自动扫描 建议用注解
		AutoBindRoutes abr = new AutoBindRoutes().autoScan(false);
//		 abr.addIncludeClasses(BugCtrl.class,IndexCtrl.class,UserCtrl.class,
//				 RoleCtrl.class,ResCtrl.class,LogCtrl.class);

		// 自动设置 jar 扫描在 maven 上面不好使
		// abr.addJars("module-admin-1.0.jar");
		me.add(abr);
	}

	/**
	 * 配置插件
	 */
	public void configPlugin(Plugins me) {

		// 配置Druid 数据库连接池插件
		
		if(ConfigKit.getStr("jdbcUrl")==null) System.out.println("请先在db.txt中配置数据库连接信息 具体查看 启动说明.txt");
		
		DruidPlugin dbPlugin = new DruidPlugin(ConfigKit.getStr("jdbcUrl"), ConfigKit.getStr("user"),
				ConfigKit.getStr("password")
		// DruidUtil.decrypt(getProperty("password"),
		// getProperty("decrypt"))
		);
		// 设置 状态监听与 sql防御
		WallFilter wall = new WallFilter();
		wall.setDbType(ConfigKit.getStr("dbType"));
		dbPlugin.addFilter(wall);
		dbPlugin.addFilter(new StatFilter());

		me.add(dbPlugin);
		// redis
		// me.add(new JedisPlugin());

		// add EhCache
		me.add(new EhCachePlugin());
		// add sql xml plugin
		me.add(new SqlInXmlPlugin());
		// add shrio
		me.add(new ShiroPlugin(this.routes));

		// 配置AutoTableBindPlugin插件 
		AutoTableBindPlugin atbp = new AutoTableBindPlugin(dbPlugin);
		if (isDev) atbp.setShowSql(true);
		atbp.autoScan(false);
//		 atbp.addIncludeClasses(Bug.class,User.class,Role.class,Res.class,Log.class);
		
		me.add(atbp);
		// sql记录
		SqlReporter.setLogger(true);

		//去 spring 化
//		ApplicationContext act = new FileSystemXmlApplicationContext("classpath:spring-*.xml");
//		SpringUtils.postProcessBeanFactory(act);
//		me.add(new SpringPlugin(act));
	}

	/**
	 * 配置全局拦截器
	 */
	public void configInterceptor(Interceptors me) {
//		me.add(new IocInterceptor());

		// shiro权限拦截器配置
		me.add(new ShiroInterceptor());
		me.add(new com.jayqqaa12.shiro.ShiroInterceptor());

		// 让 模版 可以使用session
		me.add(new SessionInViewInterceptor());
		// 对 api 接口进行 oauth2 认证。
//		me.add(new OauthIntercepter("/api/"));
	}

	/**
	 * 配置处理器
	 */
	public void configHandler(Handlers me) {
		// 计算每个page 运行时间
		// me.add(new RenderingTimeHandler());

		// xss 过滤
		me.add(new XssHandler("s"));
		// 伪静态处理
		// me.add(new FakeStaticHandler());
		// 去掉 jsessionid 防止找不到action
		me.add(new com.jayqqaa12.shiro.SessionHandler());
		me.add(new DruidStatViewHandler("/druid"));

		me.add(new ContextPathHandler());

		me.add(new ACAOlHandler("*"));
	}

	/**
	 * 运行此 main 方法可以启动项目，此main方法可以放置在任意的Class类定义中，不一定要放于此
	 */
	public static void main(String[] args) {

		JFinal.start("src/main/webapp", 8888, "/", 5);
	}

}
