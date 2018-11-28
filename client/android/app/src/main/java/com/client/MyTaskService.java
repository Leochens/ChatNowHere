package com.client;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import javax.annotation.Nullable;

public class MyTaskService extends HeadlessJsTaskService {

    @Nullable
    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {

        Bundle extras = intent.getExtras();
        if(extras!=null){
            return new HeadlessJsTaskConfig(
                    "fetchData",
                    Arguments.fromBundle(extras),
                    5000,
                    false
            );
        }
        return null;



    }
}

