package com.jayqqaa12.system.controller;

import java.util.UUID;

import com.jayqqaa12.Code;
import com.jayqqaa12.common.Consts;
import com.jayqqaa12.jbase.jfinal.ext.ctrl.JsonController;
import com.jayqqaa12.jbase.sdk.util.ShiroExt;
import com.jayqqaa12.service.EmailService;
import com.jayqqaa12.system.model.User;
import com.jfinal.ext.route.ControllerBind;

@ControllerBind(controllerKey = "/system/email")
public class EmailCtrl extends JsonController {


	public void sendValEmail() {

		User u = ShiroExt.getSessionAttr(Consts.SESSION_EAMIL_USER);
		String email = getPara("email");
		if (u != null) email = u.getStr("email");

		String uuid = UUID.randomUUID().toString();
		EmailService.sendValidatorEmail(email, uuid);

		ShiroExt.setSessionAttr("uuid", uuid);

		renderJson200();
	}

	/**
	 * 因为session 超时 前台也无法操作了 所以无需处理错误码
	 */
	public void valEmail() {
		User u = ShiroExt.getSessionAttr(Consts.SESSION_EAMIL_USER);

		String uuid = ShiroExt.getSessionAttr("uuid");

		if (getPara("val").equals(uuid)) {
			if (u != null) {
				u.encrypt().saveAndCreateDate();
				ShiroExt.setSessionAttr(Consts.SESSION_EAMIL_USER, null);
			}

			renderJson200();
		} else sendJson(Code.EMAIL_VAL_ERROR);

	}

	public void existEmail() {
		int code = 200;
		if (User.dao.findByEmail(getPara("email")) != null) code = Code.EMAIL_VAL_ERROR;
		sendJson(code);
	}

}
