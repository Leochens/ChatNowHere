package com.client;

import android.widget.Toast;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

public class ZHLToast implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ZToast(reactContext));
        return modules;
    }


    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }


    class ZToast extends ReactContextBaseJavaModule {
        private static final String DURATION_SHORT_KEY = "SHORT";
        private static final String DURATION_LONG_KEY = "LONG";

        public ZToast(ReactApplicationContext reactContext){
            super(reactContext);
        }

        @Nullable
        @Override
        public Map<String, Object> getConstants() {
            final Map<String,Object> constants = new HashMap();
            constants.put(DURATION_LONG_KEY,Toast.LENGTH_LONG);
            constants.put(DURATION_SHORT_KEY,Toast.LENGTH_SHORT);

            return constants;
        }

        @ReactMethod
        public void show(String message,int duration){
            Toast.makeText(getReactApplicationContext(),message+" lalala",duration).show();
        }

        @Override
        public String getName() {
            return "ZToast";
        }
    }
}

