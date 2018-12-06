package com.client;

import android.app.Application;
import com.backHome.AppReactPackage;
import android.database.sqlite.SQLiteDatabase;
import android.widget.Toast;

import com.client.db.ReactSQLiteModule;
import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImagePickerPackage(),
            new RNExitAppPackage()
,new AppReactPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
              new ZHLToast(),
              new ServicePackage(),
              new ReactSQLiteModule(),
              new GetLocationPackage()
      );
    }


    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    SoLoader.init(this, /* native exopackage */ false);
  }

}
