package com.jayqqaa12.system.controller;

import com.jayqqaa12.jbase.jfinal.ext.ctrl.JsonController;
import com.jayqqaa12.jbase.jfinal.ext.spring.Inject;
import com.jayqqaa12.model.json.SendJson;
import com.jayqqaa12.shiro.ShiroCache;
import com.jayqqaa12.shiro.ShiroInterceptor;
import com.jayqqaa12.system.model.Res;
import com.jayqqaa12.system.model.Role;
import com.jfinal.ext.route.ControllerBind;

@ControllerBind(controllerKey = "/system/res")
public class ResCtrl extends JsonController<Res> {


	public void tree() throws Exception {
		Integer pid = getParaToInt("id");
		Integer passId = getParaToInt("passId");
		int type = getParaToInt("type", Res.TYPE_MEUE);
		sendJson("tree", Res.dao.getTree(pid, type, passId));
	}
	
	/**
	 * 返回给前端权限控制
	 */
	public void urls(){
		
		  setJsonData("urls",Res.dao.getUrls());
		 setJsonData("auth_urls", Res.dao.getAuthUrls());
		
		sendJson( );
	}

	public void ztree() throws Exception {
		sendJson("ztree",Res.dao.getZTree());
	}

	public void list() {
		Integer pid = getParaToInt("id");
		SendJson json = getJsonObject();

		if (pid != null) json.setData("parent", Res.dao.findById(pid));
		json.setData("list", Res.dao.list(pid));

		sendJson(json);
	}

	public void delete() {
		renderJsonResult(Res.dao.deleteByIdAndPid(getParaToInt("id")));
		removeAuthorization();
	}

	public void batchDelete() {

		renderJsonResult(Res.dao.batchDelete(getPara("ids")));
	}

	public void save() {
		Res res = getModel();
		boolean result = false;

		if (res.getId() == null) {
			result = res.save();
			Role.dao.grant(1, res.getId() + "");
		} else result = res.update();

		removeAuthorization();

		renderJsonResult(result);
	}

	private void removeAuthorization() {
		ShiroCache.clearAuthorizationInfoAll();
		ShiroInterceptor.updateUrls();
	}

}
