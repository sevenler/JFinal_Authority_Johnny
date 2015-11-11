package com.jayqqaa12.system.model;

import com.jayqqaa12.jbase.jfinal.ext.model.Model;
import com.jfinal.ext.plugin.tablebind.TableBind;

@TableBind(tableName = "system_bug")
public class Bug extends  Model<Bug>
{
	private static final long serialVersionUID = 3706516534681611550L;
	public final static Bug dao = new Bug();





}
