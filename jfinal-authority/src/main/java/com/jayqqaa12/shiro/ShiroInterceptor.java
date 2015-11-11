package com.jayqqaa12.shiro;

import java.util.List;

import com.jayqqaa12.jbase.sdk.util.ShiroExt;
import com.jayqqaa12.system.model.Log;
import com.jayqqaa12.system.model.Res;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

/***
 * 让 shiro 基于 url 拦截
 * 
 * 主要 数据库中也用url 保存权限
 * 
 * @author 12
 * 
 */
public class ShiroInterceptor implements Interceptor {
	private static ShiroExt ext = new ShiroExt();

	/**
	 * 获取全部 需要控制的权限
	 */
	private static List<String> urls;

	public static void updateUrls() {
		urls = Res.dao.getUrls();
	}

	public void intercept(Invocation ai) {

		if (urls == null) urls = Res.dao.getUrls();

		String url = ai.getActionKey();
		try {

			if (url.contains("delete")) Log.dao.insert(ai.getController(), Log.EVENT_DELETE);
			else if (url.contains("save")) Log.dao.insert(ai.getController(), Log.EVENT_ADD);

			if (urls.contains(url) && !ext.hasPermission(url)) ai.getController().renderError(403);

		} catch (Exception e) {
			ai.getController().renderError(403);
		}

		ai.invoke();

	}

}
