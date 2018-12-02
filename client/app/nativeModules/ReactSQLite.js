import { NativeModules } from 'react-native';

const _ReactSQLite = NativeModules.ReactSQLite;
export default ReactSQLite = _ReactSQLite;
/**
 * 创建数据库 有就不创建
 * @param {string} dbName 数据库名称
 */
function createDatabase(dbName){
    _ReactSQLite.createDatabase(dbName);
}

/**
 * 返回所有登录过的用户
 * @param {function} sucCallBack 成功时的回调函数 (res)
 */
function getAllRecentLoginUsers(sucCallBack){
    _ReactSQLite.getAllRecentLoginUsers(sucCallBack)
}

/**
 * 返回uid的用户
 * @param {int} uid 用户uid
 * @param {function} sucCallBack 成功时回调 res
 */
function getUserInfo(uid,sucCallBack){
    _ReactSQLite.getUserInfo(uid,sucCallBack);
}

function addUser(username,password,uid,user_pic){
    _ReactSQLite.addUser(username,password,uid,user_pic);
}