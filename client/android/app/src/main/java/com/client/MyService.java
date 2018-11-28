package com.client;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.IBinder;
import android.widget.Toast;

import java.util.Timer;
import java.util.TimerTask;

public class MyService extends Service {


    private  BatteryReceiver batteryReceiver;
    public MyService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }

    @Override
    public void onCreate() {

        IntentFilter intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        batteryReceiver = new BatteryReceiver();
        registerReceiver(batteryReceiver,intentFilter);
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        Toast.makeText(getApplicationContext(),"进入服务",Toast.LENGTH_SHORT).show();

        return super.onStartCommand(intent, flags, startId);

    }

    @Override
    public void onDestroy() {
        unregisterReceiver(batteryReceiver);
        super.onDestroy();

    }

    private class BatteryReceiver extends BroadcastReceiver{
        @Override
        public void onReceive(Context context, Intent intent) {
            if(Intent.ACTION_BATTERY_CHANGED == intent.getAction()){
                int level = intent.getIntExtra("level",0);

                Toast.makeText(context,"当前电量"+level,Toast.LENGTH_SHORT).show();
            }
        }
    }
}
