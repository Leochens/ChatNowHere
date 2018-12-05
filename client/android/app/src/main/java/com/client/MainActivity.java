package com.client;


import android.os.Bundle;
import android.os.PersistableBundle;
import android.support.annotation.Nullable;
import android.widget.Toast;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "client";
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
        Toast.makeText(getApplicationContext(),"create",Toast.LENGTH_SHORT).show();

        super.onCreate(savedInstanceState, persistentState);
    }

    @Override
    protected void onDestroy() {
        Toast.makeText(getApplicationContext(),"destory",Toast.LENGTH_SHORT).show();
        super.onDestroy();
    }

    //    @Override
//    public void invokeDefaultOnBackPressed() {
//        PackageManager pm = getPackageManager();
//        ResolveInfo homeInfo =
//                pm.resolveActivity(new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME), 0);
//        ActivityInfo ai = homeInfo.activityInfo;
//        Intent startIntent = new Intent(Intent.ACTION_MAIN);
//        startIntent.addCategory(Intent.CATEGORY_LAUNCHER);
//        startIntent.setComponent(new ComponentName(ai.packageName, ai.name));
//        startActivity(startIntent);
//    }
}
