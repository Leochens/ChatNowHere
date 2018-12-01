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
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ViewManager;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;


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
        public void getUser(String uid){
            Cursor cursor = db.rawQuery("SELECT * FROM user WHERE uid = "+uid,null);

        }

        /**
         * 通过回调 返回rn数据 [{},{},{},{}] NOTE!
         * @param suc
         */
        @ReactMethod
        public void getAll(Callback suc){
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

        @ReactMethod
        public void insertUser(String name,String password,int uid,String user_pic){
            // 有就替换 没有就创建 避免异常
            db.execSQL("REPLACE INTO user(username,password,uid,user_pic) VALUES (?,?,?,?)",new Object[]{name,password,uid,user_pic});


        }
        @Override
        public String getName() {
            return "ReactSQLite";
        }
    }

}
