package com.client.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class DBhelper extends SQLiteOpenHelper {
    /**
     * MyOpenHelper构造方法
     * @param context 上下文
     * @param name 数据库文件的名字
     * @param factory 游标工厂(结果集)
     * @param version 数据库的版本号(用于升级)
     */
    public DBhelper(Context context, String name, SQLiteDatabase.CursorFactory factory, int version) {
        super(context, name, factory, version);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {//创建数据库时,调用此方法

        Log.d("zhlsql", "数据库创建成功");
        //创建一个学生表
        //1.创建数据库的语句
        //构造建表语句
        String createUser = "create table user (" +
                "username varchar," +// 用户名
                "password varchar,"+//用户密码
                "uid integer PRIMARY KEY NOT NULL,"+ // 用户编号 服务器端编号
                "user_pic varchar"+// 用户头像路径
                ")";
        String createMessage = "create table message ("+
                "id integer PRIMARY KEY AUTOINCREMENT NOT NULL," +// 本地序号
//                "mid integer," +// 服务器端消息id
                "from_id integer," +// 发消息者id
                "from_name varchar," +// 发消息人用户名
                "to_id integer," +// 接受者id
                "to_name varchar," +// 接受者用户名
                "create_time varchar," +// 消息发送时间
                "content varchar," + // 消息内容
                "type integer," + // 消息类型 1 自己 2 其他人 3 系统
                "msg_status integer"+ // 消息状态 1 发送者发送成功 2 发送成功并且接受者接受成功
                ")";
        String createChatList = "create table chat_list (" +
                "uid integer UNIQUE," +// 用户服务器端id
                "login_user_id integer PRIMARY KEY NOT NULL,"+
                "login_user_name varchar,"+
                "username varchar, " +// 消息列表项的用户名
                "user_pic varchar," +// 用户头像
                "last_msg_content varchar," +// 最后一条消息的内容
                "last_msg_time varchar," +// 最后一条消息的时间
                "new_msg_count integer" +// 新消息的条数 默认为0 每更新一次+1
                ")";
        db.execSQL(createUser);
        db.execSQL(createMessage);
        db.execSQL(createChatList);
    }
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {//数据库升级时调用此方法
        Log.d("MainActivity", "数据库升级成功");
    }
}