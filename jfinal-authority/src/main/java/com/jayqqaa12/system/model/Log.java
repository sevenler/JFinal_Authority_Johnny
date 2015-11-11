package com.jayqqaa12.system.model;

import java.util.List;

import com.github.abel533.echarts.axis.CategoryAxis;
import com.github.abel533.echarts.axis.ValueAxis;
import com.github.abel533.echarts.code.Magic;
import com.github.abel533.echarts.code.Tool;
import com.github.abel533.echarts.code.Trigger;
import com.github.abel533.echarts.feature.MagicType;
import com.github.abel533.echarts.json.GsonOption;
import com.github.abel533.echarts.series.Line;
import com.github.abel533.echarts.style.AreaStyle;
import com.github.abel533.echarts.style.ItemStyle;
import com.github.abel533.echarts.style.itemstyle.Normal;
import com.google.common.collect.Lists;
import com.jayqqaa12.common.Consts;
import com.jayqqaa12.jbase.jfinal.ext.model.Model;
import com.jayqqaa12.jbase.jfinal.ext.util.ModelKit;
import com.jayqqaa12.jbase.sdk.util.ShiroExt;
import com.jayqqaa12.jbase.util.DateUtil;
import com.jayqqaa12.jbase.util.IpUtil;
import com.jayqqaa12.jbase.util.L;
import com.jayqqaa12.model.json.Form;
import com.jayqqaa12.shiro.SessionDAO;
import com.jfinal.core.Controller;
import com.jfinal.ext.plugin.tablebind.TableBind;

import eu.bitwalker.useragentutils.Browser;
import eu.bitwalker.useragentutils.UserAgent;

@TableBind(tableName = "system_log")
public class Log extends Model<Log> {
	private static final long serialVersionUID = -128801010211787215L;
	public final static Log dao = new Log();

	public static final int EVENT_VISIT = 1;
	public static final int EVENT_LOGIN = 2;
	public static final int EVENT_ADD = 3;
	public static final int EVENT_DELETE = 4;
	
	


	public void insert(Controller con, int operation) {

		UserAgent userAgent = UserAgent.parseUserAgentString(con.getRequest().getHeader("User-Agent"));
		Browser browser = userAgent.getBrowser();

		String ip = IpUtil.getIp(con.getRequest());
		String from = con.getRequest().getHeader("Referer");
		User user = ShiroExt.getSessionAttr(Consts.SESSION_USER);
		Log event = new Log().set("ip", ip).set("from", from);
		if (user != null) event.set("uid", user.getId());

		event.set("url", con.getRequest().getRequestURI());
		event.set("browser", browser.getName());
		event.set("operation", operation).saveAndDate();

	}

	public Model browser() {

		Model map = new Model();

		map.put("chrome", 0L);
		map.put("ie", 0L);
		map.put("firefox", 0L);
		map.put("opera", 0L);
		map.put("safari", 0L);

		for (Log log : find(sql("system_log.browser"))) {

			if (log.getStr("browser").toLowerCase().contains("chrome")) {
				map.put("chrome", map.getLong("chrome") + log.getLong("c"));
			}
			if (log.getStr("browser").toLowerCase().contains("firefox")) {
				map.put("firefox", map.getLong("firefox") + log.getLong("c"));
			}
			if (log.getStr("browser").toLowerCase().contains("opera")) {
				map.put("opera", map.getLong("opera") + log.getLong("c"));
			}
			if (log.getStr("browser").toLowerCase().contains("explorer")) {
				map.put("ie", map.getLong("ie") + log.getLong("c"));
			}
			if (log.getStr("browser").toLowerCase().contains("safari")) {
				map.put("safari", map.getLong("safari") + log.getLong("c"));
			}
		}
		return map;
	}

	public Model getVisitCount() {

		Model m = new Model();

		m.put("visit", findFirst("SELECT count(*)as c FROM `system_log` where operation =1 ").getLong("c"));
		m.put("login", findFirst("SELECT count(*)as c FROM `system_log` where operation =2 ").getLong("c"));

		m.put("online", SessionDAO.me.getActiveSessions().size());

		return m;
	}

	public List<Log> log(Form from) {

		List<Res> resList = Res.dao.listByCache();

		List<Log> list = list(from.getWhereAndLimit());
		for (Log log : list) {
			Res res = (Res) ModelKit.getValue("url", log.getStr("url"), resList);
			if (res != null) log.putModel("res", res);
		}

		return list;
	}

	public GsonOption chart() {

		List<Log> logs = find(sql("system_log.chart"));

		List<Object> date = Lists.newArrayList();

		for (int i = 6; i >= 0; i--) {
			date.add(DateUtil.addDay(-i));
		}
		
		L.i("date ="+date);

		GsonOption option = new GsonOption();
		option.legend("访问", "登录", "保存", "删除");
		option.toolbox()
				.show(true)
				.feature(Tool.mark, Tool.dataView, new MagicType(Magic.line, Magic.bar), Tool.restore, Tool.saveAsImage);

		option.calculable(true);
		option.tooltip().trigger(Trigger.axis);

		CategoryAxis valueAxis = new CategoryAxis();
		valueAxis.setData(date);
		option.xAxis(valueAxis);
		option.yAxis(new ValueAxis());

		Line[] lines = new Line[] { new Line(), new Line(), new Line(), new Line() };

		int i = 1;
		for (Line line : lines) {
			int type = i++;
			if (type == Log.EVENT_VISIT) line.name("访问");
			if (type == Log.EVENT_LOGIN) line.name("登录");
			if (type == Log.EVENT_ADD) line.name("保存");
			if (type == Log.EVENT_DELETE) line.name("删除");
			line.itemStyle(new ItemStyle().normal(new Normal().areaStyle(new AreaStyle())));

			List<Object> objs = Lists.newArrayList();

			for (Object d : date) {
				
				boolean ok =false;
				for (Log log : logs) {
					if (log.getInt("operation") == type && log.getDate().equals((String)d)) {
						objs.add(log.getLong("c"));
						ok=true;
					}
				}
				
				if(!ok)objs.add(0);
			}
			line.setData(objs);
		}

		option.series(lines);

		return option;
	}
}
