package com.client;

import android.content.Context;
import android.location.Criteria;
import android.location.LocationManager;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

public class GetLocationPackage implements ReactPackage{

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new GetLocation(reactContext));
        return modules;
    }


    class GetLocation extends ReactContextBaseJavaModule {

        private Context context;
        @Nullable
        @Override
        public Map<String, Object> getConstants() {
            return super.getConstants();
        }
        public GetLocation(ReactApplicationContext context){
            super(context);
            this.context = context;
        }

        @ReactMethod
        public void getLocation(){
            Criteria criteria = new Criteria();
            criteria.setAccuracy(Criteria.ACCURACY_FINE);
            criteria.setAltitudeRequired(false); //海拔信息：不需要
            criteria.setBearingRequired(false); //方位信息: 不需要
            criteria.setCostAllowed(true);  //是否允许付费
            criteria.setPowerRequirement(Criteria.POWER_LOW); //耗电量: 低功耗
        }

        @Override
        public String getName() {
            return "GetLocation";
        }
    }
}

