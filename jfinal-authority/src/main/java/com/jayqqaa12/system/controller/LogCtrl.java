package com.jayqqaa12.system.controller;

import java.io.File;
import java.io.IOException;

import com.jayqqaa12.jbase.jfinal.ext.ctrl.JsonController;
import com.jayqqaa12.jbase.jfinal.ext.spring.Inject;
import com.jayqqaa12.jbase.util.Fs;
import com.jayqqaa12.model.json.SendJson;
import com.jayqqaa12.system.model.Log;
import com.jfinal.aop.Before;
import com.jfinal.ext.route.ControllerBind;
import com.jfinal.plugin.ehcache.CacheName;
import com.jfinal.plugin.ehcache.EvictInterceptor;

@CacheName(value = "/system/log")
@ControllerBind(controllerKey = "/system/log")
public class LogCtrl extends JsonController<Log> {


	public void data() {
		sendJson(Log.dao.getVisitCount());
	}

	public void browser() {
		sendJson(Log.dao.browser());

	}

	public void list() {

		setJsonData("list", Log.dao.log(getFrom(Log.dao.tableName)));
		setJsonData("total", Log.dao.getCountByWhere(getFrom(Log.dao.tableName).getWhere()));
		sendJson();

	}

	public void error() throws IOException {

		String log = Fs.readFile(new File(System.getProperty("LOGDIR") + "/jfinal.log"));
		renderText(log);
	}

	@Before(value = { EvictInterceptor.class })
	public void delete() {
		renderJsonResult(Log.dao.deleteById(getPara("id")));
	}

	public void chart() {
		

		renderGson(Log.dao.chart());
	}

}
