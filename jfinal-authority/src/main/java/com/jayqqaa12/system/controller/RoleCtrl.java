package com.jayqqaa12.system.controller;

import com.jayqqaa12.jbase.jfinal.ext.ctrl.JsonController;
import com.jayqqaa12.jbase.jfinal.ext.spring.Inject;
import com.jayqqaa12.shiro.ShiroCache;
import com.jayqqaa12.system.model.Role;
import com.jayqqaa12.system.validator.RoleValidator;
import com.jfinal.aop.Before;
import com.jfinal.ext.route.ControllerBind;

@ControllerBind(controllerKey = "/system/role")
public class RoleCtrl extends JsonController<Role> {


	public void list() {
		
		renderJson(Role.dao.list());
	
	}
	
//	public void tree() {
//		Integer pid = getParaToInt("id");
//		Integer passId = getParaToInt("passId");
//		renderJson(Role.dao.getTree(pid, passId));
//
//	}

	@Before(value = { RoleValidator.class })
	public void save() {
		Role role = getModel();
		String res_ids = getPara("res_ids");

		if (role.getId() != null) renderJsonResult(role.update());
		else renderJsonResult(role.save());

		Role.dao.batchGrant(role.getId(), res_ids);

		ShiroCache.clearAuthorizationInfoAll();
	}

	public void delete() {
		int id = getParaToInt("id");
		renderJsonResult(Role.dao.deleteByIdAndPid(id));
	}

}
