/*
 Navicat Premium Data Transfer

 Source Server         : 192.168.1.223
 Source Server Type    : MySQL
 Source Server Version : 80022
 Source Host           : 192.168.1.223:3306
 Source Schema         : mlphp

 Target Server Type    : MySQL
 Target Server Version : 80022
 File Encoding         : 65001

 Date: 03/12/2020 14:22:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ml_menu
-- ----------------------------
DROP TABLE IF EXISTS `ml_menu`;
CREATE TABLE `ml_menu`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '显示名称',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '显示图标',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '跳转链接',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '禁用状态 1 启用 0 禁用',
  `is_show` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否显示 1 是 0 否',
  `parent_id` int NOT NULL DEFAULT 0 COMMENT '父节点',
  `create_time` int NULL DEFAULT NULL,
  `update_time` int NULL DEFAULT NULL,
  `is_auth` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否验证权限 1 是 0 否',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '导航菜单' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ml_menu
-- ----------------------------
INSERT INTO `ml_menu` VALUES (1, '首页', NULL, 'console/index/index', 1, 1, 0, NULL, NULL, 1);
INSERT INTO `ml_menu` VALUES (2, '欢迎页', NULL, 'console/index/welcome', 1, 1, 1, NULL, NULL, 1);
INSERT INTO `ml_menu` VALUES (3, '用户管理', NULL, 'console/user', 1, 1, 0, NULL, NULL, 1);
INSERT INTO `ml_menu` VALUES (4, '用户列表', NULL, 'console/user/index', 1, 1, 3, NULL, NULL, 1);
INSERT INTO `ml_menu` VALUES (5, '系统管理', NULL, 'console/system', 1, 1, 0, 1, 1, 1);
INSERT INTO `ml_menu` VALUES (6, '系统菜单', NULL, 'console/menu/index', 1, 1, 5, 1, 1, 1);
INSERT INTO `ml_menu` VALUES (7, '添加菜单', NULL, 'console/menu/add', 1, 0, 6, 1, 1, 1);
INSERT INTO `ml_menu` VALUES (8, '编辑菜单', NULL, 'console/menu/edit', 1, 0, 6, 1, 1, 1);
INSERT INTO `ml_menu` VALUES (9, '删除菜单', NULL, 'console/menu/del', 1, 0, 6, 1, 1, 1);

-- ----------------------------
-- Table structure for ml_role
-- ----------------------------
DROP TABLE IF EXISTS `ml_role`;
CREATE TABLE `ml_role`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `create_time` int NULL DEFAULT NULL,
  `update_time` int NULL DEFAULT NULL,
  `status` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ml_role
-- ----------------------------
INSERT INTO `ml_role` VALUES (1, '超级管理员', 1, 1, 1);

-- ----------------------------
-- Table structure for ml_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `ml_role_menu`;
CREATE TABLE `ml_role_menu`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `menu_id` int NULL DEFAULT NULL,
  `role_id` int NULL DEFAULT NULL,
  `create_time` int NULL DEFAULT NULL,
  `update_time` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ml_role_menu
-- ----------------------------

-- ----------------------------
-- Table structure for ml_user
-- ----------------------------
DROP TABLE IF EXISTS `ml_user`;
CREATE TABLE `ml_user`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'id',
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '昵称',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '登录名',
  `realname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '真实姓名',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `passwd_salt` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '密码加盐字符 ',
  `passwd` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码 md5',
  `auth` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '拥有权限',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '禁用状态 0 禁用 1 启用',
  `last_login_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '最后登录ip',
  `last_login_time` int NULL DEFAULT NULL COMMENT '最后登录时间',
  `create_time` int NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` int NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ml_user
-- ----------------------------
INSERT INTO `ml_user` VALUES (1, 'admin', 'admin', 'admin', NULL, NULL, NULL, '1', NULL, 1, NULL, NULL, 1606958521, 1606958521);

-- ----------------------------
-- Table structure for ml_user_role
-- ----------------------------
DROP TABLE IF EXISTS `ml_user_role`;
CREATE TABLE `ml_user_role`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `role_id` int NULL DEFAULT NULL,
  `create_time` int NULL DEFAULT NULL,
  `update_time` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ml_user_role
-- ----------------------------
INSERT INTO `ml_user_role` VALUES (1, 1, 1, 1, 1);

SET FOREIGN_KEY_CHECKS = 1;
