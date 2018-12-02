package com.client.db;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;
import android.widget.Toast;

import com.client.MainApplication;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.NavigableMap;


public class ReactSQLiteModule implements ReactPackage{
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new DB(reactContext));

        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    class DB extends ReactContextBaseJavaModule {
        private DBhelper dh;//用于创建帮助器对象
        private SQLiteDatabase db;//用于创建数据库对象
        public DB(ReactApplicationContext context){
            super(context);
        }

        @ReactMethod
        public void createDatabase(String name){
            Toast.makeText(getReactApplicationContext(),"进入原生模块，创建数据库",Toast.LENGTH_SHORT).show();
            dh = new DBhelper(getReactApplicationContext(),name,null,1);
            db = dh.getWritableDatabase();
        }

        @ReactMethod
        public void getUserInfo(int _uid,Callback suc){
            Cursor cursor = db.rawQuery("SELECT * FROM user WHERE uid = "+_uid,null);
            WritableMap map = new WritableNativeMap();
            while (cursor.moveToNext()){

                String username = cursor.getString(cursor.getColumnIndex("username"));
                String password = cursor.getString(cursor.getColumnIndex("password"));
                int uid = cursor.getInt(cursor.getColumnIndex("uid"));
                String user_pic = cursor.getString(cursor.getColumnIndex("user_pic"));
                map.putString("username",username);
                map.putString("password",password);
                map.putInt("uid",uid);
                map.putString("user_pic",user_pic);
                Log.d("zhlsql","single||||username: "+username+" | password: "+password+" | uid: "+uid+" | user_pic: "+user_pic);
            }
            suc.invoke(map);
        }

        /**
         * 通过回调 返回rn数据 [{},{},{},{}] NOTE!
         * @param suc
         */
        @ReactMethod
        public void getAllRecentLoginUsers(Callback suc){
            Cursor cursor = db.rawQuery("SELECT * FROM user",null);
            WritableArray array = new WritableNativeArray();
            while (cursor.moveToNext()){
                String username = cursor.getString(cursor.getColumnIndex("username"));
                String password = cursor.getString(cursor.getColumnIndex("password"));
                int uid = cursor.getInt(cursor.getColumnIndex("uid"));
                String user_pic = cursor.getString(cursor.getColumnIndex("user_pic"));
                WritableMap map = new WritableNativeMap();
                map.putString("username",username);
                map.putString("password",password);
                map.putInt("uid",uid);
                map.putString("user_pic",user_pic);
                array.pushMap(map);
                Log.d("zhlsql","username: "+username+" | password: "+password+" | uid: "+uid+" | user_pic: "+user_pic);
            }
            suc.invoke(array);
        }

        // 存登录过的用户
        @ReactMethod
        public void addUser(ReadableMap map ){
            String username = map.getString("username");
            String password = map.getString("password");
            int uid = map.getInt("uid");
            String user_pic = map.getString("user_pic");
            Log.d("zhlsql","插入数据");
            // 有就替换 没有就创建 避免异常
            db.execSQL("REPLACE INTO user(username,password,uid,user_pic) VALUES (?,?,?,?)",new Object[]{username,password,uid,user_pic});
        }

        // 存消息
        @ReactMethod
        public void addMsg(ReadableMap map){
            Log.d("zhlsql",map.toString());
            String from_name = map.getString("from_name");
            String to_name = map.getString("to_name");
            int from_id = map.getInt("from_id");
            int to_id = map.getInt("to_id");
            String content = map.getString("content");
            int type = map.getInt("type");
            int msg_status = map.getInt("msg_status");
            String create_time = map.getString("create_time");
            db.execSQL("REPLACE INTO message(from_name,to_name,from_id,to_id,content,type,msg_status,create_time) VALUES(?,?,?,?,?,?,?,?) ",
                    new Object[]{from_name,to_name,from_id,to_id,content,type,msg_status,create_time});
        }
        @ReactMethod
        public void addMsgList(ReadableArray msgList){

            for(int i = 0;i<msgList.size();i++){
                ReadableMap map = msgList.getMap(i);
                Log.d("zhlsql",map.toString());

                String from_name = map.getString("from_name");
                String to_name = map.getString("to_name");
                int from_id = map.getInt("from_id");
                int to_id = map.getInt("to_id");
                String content = map.getString("content");
                int type = map.getInt("type");
                int msg_status = map.getInt("msg_status");
                String create_time = map.getString("create_time");
                db.execSQL("REPLACE INTO message(from_name,to_name,from_id,to_id,content,type,msg_status,create_time) VALUES(?,?,?,?,?,?,?,?) ",
                    new Object[]{from_name,to_name,from_id,to_id,content,type,msg_status,create_time});
            }
        }

        // 提供一个用户的uid，更新uid用户的最新消息为chatItem
        @ReactMethod
        public void updateChatListItem(ReadableMap chatItem){
            int uid = chatItem.getInt("from_id");
            String username = chatItem.getString("from_name");
            String user_pic = chatItem.getString("user_pic");
            String last_msg_content = chatItem.getString("content");
            String last_msg_time = chatItem.getString("time");
            int new_msg_count = chatItem.getInt("bubble");
            int login_user_id = chatItem.getInt("login_user_id");
            String login_user_name = chatItem.getString("login_user_name");
            db.execSQL("REPLACE INTO chat_list(uid,username,user_pic,last_msg_content,last_msg_time,new_msg_count,login_user_id,login_user_name)" +
                "VALUES(?,?,?,?,?,?,?,?)",new Object[]{uid,username,user_pic,last_msg_content,last_msg_time,new_msg_count,login_user_id,login_user_name});
            Log.d("zhlsql","当前登录用户"+login_user_name+"更新了"+username+"的last_msg_content:"+last_msg_content+"当前与此人的未查看消息数为"+new_msg_count);
        }
        @Override
        public String getName() {
            return "ReactSQLite";
        }
    }

}
