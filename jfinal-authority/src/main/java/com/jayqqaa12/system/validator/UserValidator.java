package com.jayqqaa12.system.validator;

import com.jayqqaa12.Code;
import com.jayqqaa12.jbase.jfinal.ext.JsonValidator;
import com.jayqqaa12.jbase.jfinal.ext.spring.SpringUtils;
import com.jayqqaa12.system.model.User;
import com.jfinal.core.Controller;

public class UserValidator extends JsonValidator {

	@Override
	protected void validate(Controller c) {
		super.validate(c);

		if(c.getPara("user.id")==null&&User.dao.findByEmail(c.getPara("user.email"))!=null){
			addError(Code.EMAIL_EXIT);
		}

	}

}
