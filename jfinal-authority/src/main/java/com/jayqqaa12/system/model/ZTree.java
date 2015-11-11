package com.jayqqaa12.system.model;

import com.jayqqaa12.jbase.jfinal.ext.model.Model;

/**
 * ztree 基本model
 * @author 12
 *
 */
public class ZTree  implements java.io.Serializable{

	private static final long serialVersionUID = 6625307952110627894L;
	public Integer id;
	public Integer pId;
	public String name;
	public boolean open=true;
	public  boolean checked  =false;
	public  boolean chkDisabled =false;
	

	public ZTree(Integer id, String name, Integer pid) {
		
		this.id=id;
		this.name=name;
		this.pId=pid;
		
	}


	public void setDisCheck(boolean b) {
		
		if(b){
			checked =true;
			chkDisabled=true;
		}
		else{
			chkDisabled=false;
			checked =false;
		}
		
	}
	
	
}


