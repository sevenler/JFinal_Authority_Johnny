

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `oauth2_client`
-- ----------------------------
DROP TABLE IF EXISTS `oauth2_client`;
CREATE TABLE `oauth2_client` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) DEFAULT NULL,
  `client_id` varchar(100) DEFAULT NULL,
  `client_secret` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_oauth2_client_client_id` (`client_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of oauth2_client
-- ----------------------------
INSERT INTO oauth2_client VALUES ('1', 'test', 'c1ebe466-1cdc-4bd3-ab69-77c3561b9dee', 'd8346ea2-6017-43ed-ad68-19c0f971738b');

-- ----------------------------
-- Table structure for `oauth2_token`
-- ----------------------------
DROP TABLE IF EXISTS `oauth2_token`;
CREATE TABLE `oauth2_token` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `token` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `expires` bigint(13) DEFAULT NULL,
  `client_id` varchar(55) DEFAULT NULL,
  `uid` varchar(55) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of oauth2_token
-- ----------------------------
INSERT INTO oauth2_token VALUES ('4', '152eb72bf0d444433b9d79ff1c910daf', '1431748209246', 'c1ebe466-1cdc-4bd3-ab69-77c3561b9dee', 'admin@admin.com');


-- ----------------------------
-- Table structure for `system_bug`
-- ----------------------------
DROP TABLE IF EXISTS `system_bug`;
CREATE TABLE `system_bug` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(111) DEFAULT NULL,
  `des` text,
  `type` int(1) DEFAULT NULL COMMENT '类别',
  `createdate` datetime DEFAULT NULL,
  `modifydate` timestamp NULL DEFAULT NULL,
  `status` int(11) DEFAULT '1' COMMENT '1.待解决 2. 已处理 3.忽略',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of system_bug
-- ----------------------------
INSERT INTO system_bug VALUES ('10', '小Bug1', '<p> 急啊急啊啊啊啊 </p>', '1', '2014-12-03 00:35:15', '2014-12-05 10:14:52', '1');
INSERT INTO system_bug VALUES ('11', 'eee', 'qqqq', '1', '2014-12-11 16:06:25', '2014-12-28 00:09:40', '1');
INSERT INTO system_bug VALUES ('12', '121', '343', '1', '2015-01-16 15:18:58', '2015-01-16 15:18:58', '1');

-- ----------------------------
-- Table structure for `system_log`
-- ----------------------------
DROP TABLE IF EXISTS `system_log`;
CREATE TABLE `system_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `operation` int(11) DEFAULT '0' COMMENT '1.访问 2 登录 3.添加 4. 编辑 5. 删除',
  `from` varchar(255) DEFAULT NULL COMMENT '来源 url',
  `ip` varchar(22) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_SYSTEM_EVENT` (`uid`) USING BTREE,
  CONSTRAINT `system_log_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `system_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33073 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of system_log
-- ----------------------------
INSERT INTO system_log VALUES ('33070', '1', 'Chrome 39', '3', 'http://127.0.0.1:8888/', '127.0.0.1', '/system/role/save', '2015-05-13 15:26:22');
INSERT INTO system_log VALUES ('33071', '1', 'Chrome 39', '5', 'http://127.0.0.1:8888/', '127.0.0.1', '/system/role/delete', '2015-05-13 15:26:27');
INSERT INTO system_log VALUES ('33072', '1', 'Chrome 39', '2', 'http://127.0.0.1:8888/', '127.0.0.1', '/login', '2015-05-14 17:30:26');

-- ----------------------------
-- Table structure for `system_res`
-- ----------------------------
DROP TABLE IF EXISTS `system_res`;
CREATE TABLE `system_res` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) DEFAULT NULL,
  `name` varchar(111) DEFAULT NULL,
  `des` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `iconCls` varchar(255) DEFAULT 'am-icon-file',
  `seq` int(11) DEFAULT '1',
  `type` int(1) DEFAULT '2' COMMENT '1 功能 2 权限',
  `modifydate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of system_res
-- ----------------------------
INSERT INTO system_res VALUES ('0', null, '首页', '1234', '#/system/', 'am-icon-home', '1', '1', '2015-02-10 16:09:40');
INSERT INTO system_res VALUES ('1', null, '系统管理', '系统管理', '#', 'am-icon-desktop', '10', '1', null);
INSERT INTO system_res VALUES ('2', '1', '资源管理', null, '#/system/res', 'am-icon-coffee', '1', '1', null);
INSERT INTO system_res VALUES ('3', '1', '角色管理', null, '#/system/role', 'am-icon-group', '10', '1', null);
INSERT INTO system_res VALUES ('4', '1', '用户管理', null, '#/system/user', 'am-icon-user', '11', '1', null);
INSERT INTO system_res VALUES ('9', '4', '用户删除', null, '/system/user/delete', 'am-icon-fire', '1', '2', null);
INSERT INTO system_res VALUES ('12', '4', '搜索用户', null, '/system/user/serach', 'am-icon-files-o', '1', '2', null);
INSERT INTO system_res VALUES ('18', '2', '资源删除', null, '/system/res/delete', 'am-icon-bookmark-o', '11', '2', null);
INSERT INTO system_res VALUES ('19', '2', '资源保存', null, '/system/res/save', 'am-icon-bookmark', '11', '2', null);
INSERT INTO system_res VALUES ('28', '3', '角色删除', null, '/system/role/delete', 'am-icon-bookmark-o', '11', '2', null);
INSERT INTO system_res VALUES ('29', '3', '角色保存', null, '/system/role/save', 'am-icon-bookmark', '11', '2', null);
INSERT INTO system_res VALUES ('36', '1', '文件上传', null, '/common/file/upload', 'am-icon-download', '20', '2', null);
INSERT INTO system_res VALUES ('63', '4', '冻结用户', null, '/system/user/freeze', 'am-icon-bookmark-o', '11', '2', null);
INSERT INTO system_res VALUES ('146', '4', '用户列表', null, '/system/user/list', 'am-icon-folder', '8', '2', null);
INSERT INTO system_res VALUES ('147', '4', '用户保存', null, '/system/user/save', 'am-icon-folder', '10', '2', null);
INSERT INTO system_res VALUES ('148', '3', '批量删除', null, '/system/res/batchDelete', 'am-icon-folder', '10', '2', null);
INSERT INTO system_res VALUES ('149', '1', '错误日志', null, '#/system/error', 'am-icon-file-text-o', '13', '1', null);
INSERT INTO system_res VALUES ('150', '1', '操作记录', null, '#/system/log', 'am-icon-building-o', '11', '1', null);

-- ----------------------------
-- Table structure for `system_role`
-- ----------------------------
DROP TABLE IF EXISTS `system_role`;
CREATE TABLE `system_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(55) DEFAULT NULL,
  `des` varchar(55) DEFAULT NULL,
  `seq` int(11) DEFAULT '1',
  `iconCls` varchar(55) DEFAULT 'status_online',
  `pid` int(11) DEFAULT '0',
  `createdate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of system_role
-- ----------------------------
INSERT INTO system_role VALUES ('1', 'admin', '管理员', '1', 'status_online', null, '2015-05-05 14:24:26');
INSERT INTO system_role VALUES ('2', 'user', null, '3', 'status_online', '1', null);
INSERT INTO system_role VALUES ('3', 'guest', '1234', '2', 'status_online', null, null);

-- ----------------------------
-- Table structure for `system_role_res`
-- ----------------------------
DROP TABLE IF EXISTS `system_role_res`;
CREATE TABLE `system_role_res` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `res_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_SYSTEM_ROLE_RES_RES_ID` (`res_id`) USING BTREE,
  KEY `FK_SYSTEM_ROLE_RES_ROLE_ID` (`role_id`) USING BTREE,
  CONSTRAINT `system_role_res_ibfk_1` FOREIGN KEY (`res_id`) REFERENCES `system_res` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `system_role_res_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `system_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3095 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of system_role_res
-- ----------------------------
INSERT INTO system_role_res VALUES ('1760', '1', '2');
INSERT INTO system_role_res VALUES ('1761', '2', '2');
INSERT INTO system_role_res VALUES ('1762', '18', '2');
INSERT INTO system_role_res VALUES ('1763', '19', '2');
INSERT INTO system_role_res VALUES ('1765', '3', '2');
INSERT INTO system_role_res VALUES ('1767', '28', '2');
INSERT INTO system_role_res VALUES ('1768', '29', '2');
INSERT INTO system_role_res VALUES ('1770', '4', '2');
INSERT INTO system_role_res VALUES ('1772', '9', '2');
INSERT INTO system_role_res VALUES ('1774', '12', '2');
INSERT INTO system_role_res VALUES ('1789', '36', '2');
INSERT INTO system_role_res VALUES ('2966', '1', '3');
INSERT INTO system_role_res VALUES ('2967', '2', '3');
INSERT INTO system_role_res VALUES ('2968', '18', '3');
INSERT INTO system_role_res VALUES ('2969', '19', '3');
INSERT INTO system_role_res VALUES ('3074', '1', '1');
INSERT INTO system_role_res VALUES ('3075', '2', '1');
INSERT INTO system_role_res VALUES ('3076', '18', '1');
INSERT INTO system_role_res VALUES ('3077', '19', '1');
INSERT INTO system_role_res VALUES ('3078', '3', '1');
INSERT INTO system_role_res VALUES ('3079', '28', '1');
INSERT INTO system_role_res VALUES ('3080', '29', '1');
INSERT INTO system_role_res VALUES ('3081', '148', '1');
INSERT INTO system_role_res VALUES ('3082', '4', '1');
INSERT INTO system_role_res VALUES ('3083', '9', '1');
INSERT INTO system_role_res VALUES ('3084', '12', '1');
INSERT INTO system_role_res VALUES ('3085', '63', '1');
INSERT INTO system_role_res VALUES ('3086', '146', '1');
INSERT INTO system_role_res VALUES ('3087', '147', '1');
INSERT INTO system_role_res VALUES ('3088', '36', '1');
INSERT INTO system_role_res VALUES ('3089', '149', '1');
INSERT INTO system_role_res VALUES ('3090', '150', '1');
INSERT INTO system_role_res VALUES ('3091', '16', '1');
INSERT INTO system_role_res VALUES ('3092', '134', '1');
INSERT INTO system_role_res VALUES ('3093', '135', '1');
INSERT INTO system_role_res VALUES ('3094', '143', '1');

-- ----------------------------
-- Table structure for `system_user`
-- ----------------------------
DROP TABLE IF EXISTS `system_user`;
CREATE TABLE `system_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(55) DEFAULT NULL,
  `pwd` varchar(255) DEFAULT NULL,
  `des` varchar(55) DEFAULT NULL,
  `status` int(1) DEFAULT '1' COMMENT '#1 不在线 2.封号状态 ',
  `icon` varchar(255) DEFAULT '/images/guest.jpg',
  `email` varchar(222) DEFAULT NULL,
  `createdate` datetime DEFAULT NULL,
  `phone` int(15) DEFAULT NULL,
  `salt2` varchar(55) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of system_user
-- ----------------------------
INSERT INTO system_user VALUES ('1', 'admin', '7684a7d4aa0c29681c42503f4edeffba', '12', '1', '/system/static/i/9.jpg', 'admin@admin.com', null, '1234567', '93ace6bd41a447f078d1292deae9ec53');
INSERT INTO system_user VALUES ('21', '12', '0EECD063CDB4D838E03A56555D86A9AF', '1234', '2', '/system/static/i/5.jpg', '476335667@qq.com', '2015-04-11 15:02:53', '1342342342', null);

-- ----------------------------
-- Table structure for `system_user_role`
-- ----------------------------
DROP TABLE IF EXISTS `system_user_role`;
CREATE TABLE `system_user_role` (
  `int` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`int`),
  KEY `FK_SYSTME_USER_ROLE_USER_ID` (`user_id`) USING BTREE,
  KEY `FK_SYSTME_USER_ROLE_ROLE_ID` (`role_id`) USING BTREE,
  CONSTRAINT `system_user_role_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `system_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `system_user_role_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `system_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of system_user_role
-- ----------------------------
INSERT INTO system_user_role VALUES ('106', '13', '2');
INSERT INTO system_user_role VALUES ('146', '1', '1');
INSERT INTO system_user_role VALUES ('150', '21', '2');

