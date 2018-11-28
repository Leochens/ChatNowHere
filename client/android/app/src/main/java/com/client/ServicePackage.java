package com.client;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;



public class ServicePackage implements ReactPackage{

    private ReactApplicationContext reactContext;
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new Test(reactContext));

        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }


    class Test extends ReactContextBaseJavaModule {

        Test(ReactApplicationContext reactContext){
            super(reactContext);

        }
        private final String REACT_CLASS = "ZService";
        @Override
        public String getName() {
            return REACT_CLASS;
        }

        @Nullable
        @Override
        public Map<String, Object> getConstants() {

            return super.getConstants();
        }





        @ReactMethod
        public void test(){
            Toast.makeText(getReactApplicationContext(),"hello test service",Toast.LENGTH_SHORT).show();
            Intent intent = new Intent(reactContext,MyService.class);
            reactContext.startService(intent);

        }



    }

}

