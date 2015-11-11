package com.jayqqaa12.common;

import com.jayqqaa12.Code;
import com.jayqqaa12.jbase.jfinal.ext.JsonValidator;
import com.jayqqaa12.jbase.util.RSA;
import com.jayqqaa12.jbase.util.Validate;
import com.jfinal.core.Controller;

public class LoginValidator extends JsonValidator
{

	@Override
	protected void validate(Controller c)
	{
		super.validate(c);
		
		validateRequiredString("key",Code.NULL);

		//		 boolean validate = CaptchaRender.validate(this, getPara("code"), "code");
		
		
		String key = c.getPara("key");
		if (!Validate.isEmpty(key))
		{
			String [] result = RSA.decryptUsernameAndPwd(key);
			if (result==null) addError(Code.NULL);
		}

	}

 

}
