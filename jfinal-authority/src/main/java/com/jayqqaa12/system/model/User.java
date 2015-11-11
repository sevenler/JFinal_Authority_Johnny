package com.jayqqaa12.system.model;

import java.util.Iterator;
import java.util.List;

import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.SimpleHash;

import com.jayqqaa12.common.Consts;
import com.jayqqaa12.jbase.jfinal.ext.model.Model;
import com.jayqqaa12.jbase.jfinal.ext.util.ListUtil;
import com.jayqqaa12.jbase.sdk.util.ShiroExt;
import com.jayqqaa12.shiro.ShiroCache;
import com.jfinal.ext.plugin.tablebind.TableBind;
import com.jfinal.plugin.activerecord.Db;

@TableBind(tableName = "system_user")
public class User extends Model<User> {
	
	private static final long serialVersionUID = -7615377924993713398L;
	public final static User dao = new User();


	public User getUser(Object id) {

		User u = super.findById(id);
		List<Role> role = Role.dao.getRole(u.getId());
		u.put("role_ids", ListUtil.listToString(role, "id"));

		u.remove("createdate", "pwd");

		return u;
	}

	/**
	 * 其他用户 隐藏 admin
	 */
	public List<User> list(int p, int c) {
		List<User> list = super.list(p, c);
		Iterator<User> users = list.iterator();
		User now = ShiroExt.getSessionAttr(Consts.SESSION_USER);

		while (users.hasNext()) {
			User u = users.next();
			List<Role> role = Role.dao.getRole(u.getId());
			u.put("role_ids", ListUtil.listToString(role, "id"));
			u.put("role_names", ListUtil.listToString(role, "name"));
			if (u.getInt("id") == 1 && now.getInt("id") != 1) users.remove();
		}

		return list;
	}

	public List<String> getRolesName(String loginName) {
		return getAttr(sql("system_role.getRolesName"), "name", loginName);
	}

	public boolean grant(Integer[] role_ids, Integer userId) {
		boolean result = Db.deleteById("system_user_role", "user_id", userId);

		if (role_ids == null) return result;

		Object[][] params = ListUtil.ArrayToArray(userId, role_ids);
		result = Db.batch("insert into system_user_role(user_id,role_id)  values(?,?)", params, role_ids.length).length > 0;

		ShiroCache.clearAuthorizationInfoAll();

		return result;
	}

	public String getSalt() {
		return getStr("email") + getStr("salt2");
	}

	public User encrypt() {
		String pwd = this.getPwd();

		if (pwd != null) {
			String salt2 = new SecureRandomNumberGenerator().nextBytes().toHex();
			SimpleHash hash = new SimpleHash("md5", pwd, getStr("email") + salt2, 2);
			pwd = hash.toHex();
			this.set("pwd", pwd);
			this.set("salt2", salt2);
		}

		return this;
	}

	public boolean batchGrant(Integer[] role_ids, String uids) {
		boolean result = Db.update("delete from system_user_role where user_id in (" + uids + ")") > 0;

		if (role_ids == null) return result;

		Object[][] params = ListUtil.ArrayToArray(uids, role_ids);

		result = Db.batch("insert into system_user_role(user_id,role_id)  values(?,?)", params, params.length).length > 0;

		ShiroCache.clearAuthorizationInfoAll();

		return result;
	}

	public boolean changeStaus(Integer id, Integer status) {
		if (status == null) return false;
		if (status.equals(1)) status = 2;
		else status = 1;
		return update("status", status, id);

	}

	public User findByEmail(String email) {

		return findFirstByWhere("where email=?", email);
	}

}
