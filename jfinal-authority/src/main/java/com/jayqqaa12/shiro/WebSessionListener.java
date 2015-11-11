package com.jayqqaa12.shiro;


import org.apache.shiro.session.Session;
import org.apache.shiro.session.SessionListenerAdapter;

import com.jayqqaa12.jbase.util.L;
import com.jayqqaa12.system.model.Log;

public class WebSessionListener extends SessionListenerAdapter {

	
	
	@Override
	public void onExpiration(Session session) {
		
		L.i("onExpiration session +"+session);
		super.onExpiration(session);
	}
	
 

 
}
