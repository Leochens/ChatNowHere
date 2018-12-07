package com.client.db;

import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.support.v7.app.AppCompatActivity;
import android.telecom.Call;
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
        private Context context;
        public DB(ReactApplicationContext context){
            super(context);
            this.context = context;
        }

        @ReactMethod
        public void createDatabase(String name){
            Toast.makeText(getReactApplicationContext(),"进入原生模块，创建数据库"+name,Toast.LENGTH_SHORT).show();
            dh = new DBhelper(getReactApplicationContext(),name,null,1);
            db = dh.getWritableDatabase();
        }

        @ReactMethod
        public void setUserInfo(ReadableMap map){
            int uid = map.getInt("uid");
            String username = map.getString("username");
            String password = map.getString("password");
            String user_pic = map.getString("user_pic");
            db.execSQL("REPLACE INTO user(uid,username,password,user_pic) VALUES(?,?,?,?)",
                    new Object[]{uid,username,password,user_pic});
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

        // 存消息
        @ReactMethod
        public void addMsg(ReadableMap map){
            Log.d("zhlsql",map.toString());

            int friend_id = map.getInt("friend_id");
            String friend_name = map.getString("friend_name");
            String create_time = map.getString("create_time");
            String content = map.getString("content");
            int send_type = map.getInt("send_type");
            int type = map.getInt("type");
            int msg_status = map.getInt("msg_status");

            String sql = "REPLACE INTO message (friend_id,friend_name,create_time,content,send_type,type,msg_status) VALUES(?,?,?,?,?,?,?)";
            db.execSQL(sql,new Object[]{friend_id,friend_name,create_time,content,send_type,type,msg_status});
        }

        @ReactMethod
        public void getMoreRecords(int _friend_id,int initId,Callback sucCallback){
            Cursor cursor = db.rawQuery("SELECT * FROM message WHERE friend_id='"+_friend_id+"' and id < '"+initId+"' ORDER BY id DESC LIMIT 20",null);

            WritableArray list = new WritableNativeArray();

            while (cursor.moveToNext()){
                WritableMap map = new WritableNativeMap();

                int id = cursor.getInt(cursor.getColumnIndex("id"));
                int friend_id = cursor.getInt(cursor.getColumnIndex("friend_id"));
                String friend_name = cursor.getString(cursor.getColumnIndex("friend_name"));
                String create_time = cursor.getString(cursor.getColumnIndex("create_time"));
                String content = cursor.getString(cursor.getColumnIndex("content"));
                int send_type = cursor.getInt(cursor.getColumnIndex("send_type"));
                int type = cursor.getInt(cursor.getColumnIndex("type"));
                int msg_status = cursor.getInt(cursor.getColumnIndex("msg_status"));

                map.putInt("id",id);
                map.putInt("friend_id",friend_id);
                map.putString("friend_name",friend_name);
                map.putString("create_time",create_time);
                map.putString("content",content);
                map.putInt("send_type",send_type);
                map.putInt("type",type);
                map.putInt("msg_status",msg_status);
                list.pushMap(map);
            }
            Log.d("zhlsql","查询和好友"+_friend_id+"的聊天记录"+list.toString());
            sucCallback.invoke(list);
        }
        @ReactMethod
        public void getChatRecords(int _friend_id,Callback sucCallback){
            Cursor cursor = db.rawQuery("SELECT * FROM message WHERE friend_id='"+_friend_id+"' order by id desc LIMIT 20",null);

            WritableArray list = new WritableNativeArray();

            while (cursor.moveToNext()){
                WritableMap map = new WritableNativeMap();

                int id = cursor.getInt(cursor.getColumnIndex("id"));
                int friend_id = cursor.getInt(cursor.getColumnIndex("friend_id"));
                String friend_name = cursor.getString(cursor.getColumnIndex("friend_name"));
                String create_time = cursor.getString(cursor.getColumnIndex("create_time"));
                String content = cursor.getString(cursor.getColumnIndex("content"));
                int send_type = cursor.getInt(cursor.getColumnIndex("send_type"));
                int type = cursor.getInt(cursor.getColumnIndex("type"));
                int msg_status = cursor.getInt(cursor.getColumnIndex("msg_status"));

                map.putInt("id",id);
                map.putInt("friend_id",friend_id);
                map.putString("friend_name",friend_name);
                map.putString("create_time",create_time);
                map.putString("content",content);
                map.putInt("send_type",send_type);
                map.putInt("type",type);
                map.putInt("msg_status",msg_status);
                list.pushMap(map);
            }
            Log.d("zhlsql","查询和好友"+_friend_id+"的聊天记录"+list.toString());
            sucCallback.invoke(list);
        }

        @ReactMethod
        public void addMsgList(ReadableArray msgList){

            for(int i = 0;i<msgList.size();i++){
                ReadableMap map = msgList.getMap(i);
                Log.d("zhlsql",map.toString());

                int friend_id = map.getInt("friend_id");
                String friend_name = map.getString("friend_name");
                String create_time = map.getString("create_time");
                String content = map.getString("content");
                int send_type = map.getInt("send_type");
                int type = map.getInt("type");
                int msg_status = map.getInt("msg_status");
                db.execSQL("REPLACE INTO message(friend_id,friend_name,create_time,content,send_type,type,msg_status) VALUES(?,?,?,?,?,?,?) ",
                        new Object[]{friend_id,friend_name,create_time,content,send_type,type,msg_status});
            }
        }

        // 提供一个用户的uid，更新uid用户的最新消息为chatItem
        @ReactMethod
        public void updateChatListItem(ReadableMap chatItem){
            int friend_id = chatItem.getInt("friend_id");
            String friend_name = chatItem.getString("friend_name");
            String friend_pic = chatItem.getString("friend_pic");
            String last_msg_content = chatItem.getString("last_msg_content");
            String last_msg_time = chatItem.getString("last_msg_time");
            int new_msg_count = chatItem.getInt("new_msg_count");
            db.execSQL("REPLACE INTO chat_list(friend_id,friend_name,friend_pic,last_msg_content,last_msg_time,new_msg_count) VALUES(?,?,?,?,?,?)",
                    new Object[]{friend_id,friend_name,friend_pic,last_msg_content,last_msg_time,new_msg_count});
            Log.d("zhlsql","当前登录用户更新了"+friend_name+"的last_msg_content:"+last_msg_content+"当前与此人的未查看消息数为"+new_msg_count);
        }

        // 获得消息列表
        @ReactMethod
        public void getChatList(Callback sucCallback){
            Cursor cursor = db.rawQuery("SELECT * FROM chat_list",null);
            WritableArray list = new WritableNativeArray();
            while(cursor.moveToNext()){
                WritableMap map = new WritableNativeMap();
                map.putInt("friend_id",cursor.getInt(cursor.getColumnIndex("friend_id")));
                map.putString("friend_name",cursor.getString(cursor.getColumnIndex("friend_name")));
                map.putString("friend_pic",cursor.getString(cursor.getColumnIndex("friend_pic")));
                map.putString("last_msg_content",cursor.getString(cursor.getColumnIndex("last_msg_content")));
                map.putString("last_msg_time",cursor.getString(cursor.getColumnIndex("last_msg_time")));
                map.putInt("new_msg_count",cursor.getInt(cursor.getColumnIndex("new_msg_count")));
                list.pushMap(map);
            }
            sucCallback.invoke(list);
        }

        @ReactMethod
        public void deleteFriendRecords(int friend_id){
            db.execSQL("DELETE  FROM message WHERE friend_id ='"+friend_id+"'");
            db.execSQL("DELETE FROM chat_list WHERE friend_id = '"+friend_id+"'");
            Toast.makeText(getReactApplicationContext(),"删除成功",Toast.LENGTH_SHORT).show();
        }
        // 消除
        @ReactMethod
        public void clearUnreadMsgCount(int _friend_id){

            db.execSQL("UPDATE chat_list SET new_msg_count = 0 WHERE friend_id='"+_friend_id+"'");
            Log.d("zhlsql","清空好友"+_friend_id+"的未读提醒");
        }

        // 设置侧边栏背景图
        @ReactMethod
        public void setSiderBgImage(String filePath){
            SharedPreferences sharedPreferences = context.getSharedPreferences("config",Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.putString("SiderBgImg",filePath);
            editor.commit();
        }

        // 获取侧边栏背景图
        @ReactMethod
        public void getSiderBgImage(Callback sucCallback){
            SharedPreferences sharedPreferences = context.getSharedPreferences("config",Context.MODE_PRIVATE);
            String bg = sharedPreferences.getString("SiderBgImg","");
            sucCallback.invoke(bg);
        }

        @Override
        public String getName() {
            return "ReactSQLite";
        }
    }

}
