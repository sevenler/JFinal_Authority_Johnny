package com.jayqqaa12.common;

import java.security.interfaces.RSAPublicKey;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.commons.codec.binary.Hex;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;

import com.jayqqaa12.Code;
import com.jayqqaa12.jbase.jfinal.ext.ctrl.JsonController;
import com.jayqqaa12.jbase.sdk.util.ShiroExt;
import com.jayqqaa12.jbase.util.RSA;
import com.jayqqaa12.model.json.SendJson;
import com.jayqqaa12.shiro.ShiroCache;
import com.jayqqaa12.system.model.Log;
import com.jayqqaa12.system.model.User;
import com.jfinal.aop.Before;
import com.jfinal.ext.render.CaptchaRender;
import com.jfinal.ext.route.ControllerBind;

/***
 * 
 * 月落斜阳 灯火阑珊
 * 
 * @author 12
 * 
 */
@ControllerBind(controllerKey = "/")
public class IndexCtrl extends JsonController {


	public void rsa() {

		RSAPublicKey publicKey = RSA.getDefaultPublicKey();
		String modulus = new String(Hex.encodeHex(publicKey.getModulus().toByteArray()));
		String exponent = new String(Hex.encodeHex(publicKey.getPublicExponent().toByteArray()));

		SendJson json = getJsonObject();
		json.setData("modulus", modulus);
		json.setData("exponent", exponent);
		json.setData("email", getCookie("email"));

		if (SecurityUtils.getSubject().isAuthenticated()) {

			json.setData(Consts.SESSION_USER, (User) ShiroExt.getSessionAttr(Consts.SESSION_USER));
			json.code = Code.LOGING;
		}
		sendJson(json);
	}

	public void jump() {
		Log.dao.insert(this, Log.EVENT_VISIT);
		renderError(401);
	}

	@Before({ LoginValidator.class })
	public void login() {

		int code = 200;

		try {
			String[] result = RSA.decryptUsernameAndPwd(getPara("key"));

			AtomicInteger retryCount = (AtomicInteger) ShiroCache.getCacheManager().getCache("passwordRetryCache")
					.get(result[0]);
			// 错误2次密码 需要验证 验证码
			if (retryCount!=null&&retryCount.incrementAndGet() > 1) {
				String inputRandomCode = getPara("code");
				if(inputRandomCode!=null) inputRandomCode=inputRandomCode.toUpperCase();
				
				boolean loginSuccess = CaptchaRender.validate(this, inputRandomCode, "code");
				if(!loginSuccess)code=Code.CAPTCHA_ERROR;
			}

			if (code == 200) {
				UsernamePasswordToken token = new UsernamePasswordToken(result[0], result[1]);
				Subject subject = SecurityUtils.getSubject();
				if (!subject.isAuthenticated()) {
					token.setRememberMe(false);
					subject.login(token);
					User u = User.dao.findByEmail(result[0]);
					subject.getSession(true).setAttribute(Consts.SESSION_USER, u);
				}
				if (getParaToBoolean("remember")) {
					setCookie("email", result[0], 60 * 60 * 24 * 7);
				} else removeCookie("email");
				Log.dao.insert(this, Log.EVENT_LOGIN);
			}

		} catch (UnknownAccountException e) {
			code = (Code.USER_NOT_EXIT);
			e.printStackTrace();
		} catch (IncorrectCredentialsException e) {
			code = (Code.USER_PWD_ERROR);
			e.printStackTrace();
		} catch (LockedAccountException e) {
			code = (Code.USER_FRRZE);
			e.printStackTrace();
		} catch (ExcessiveAttemptsException e) {
			code = (Code.USER_ATTEMPT);
			e.printStackTrace();
		} catch (AuthenticationException e) {
			code = (Code.USER_AUTH);
			e.printStackTrace();
		} catch (Exception e) {
			code = (Code.SERVER_ERROR);
			e.printStackTrace();
		}
		
		sendJson(code);
	}

	public void logout() {
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.logout();
			sendJson();

		} catch (AuthenticationException e) {
			e.printStackTrace();
		}
	}

	public void captcha() {

		render(new CaptchaRender("code"));
	}

}
