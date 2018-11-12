package com.example.leochens.servicetest;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.Toast;

public class MainActivity extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        this.initView();
    }

    private void initView(){
        Button playButton = ( Button )super.findViewById( R.id.play );
        Button stopButton = ( Button )super.findViewById( R.id.stop );
        playButton.setOnClickListener( clickListener );
        stopButton.setOnClickListener( clickListener );
    }

    private OnClickListener clickListener = new OnClickListener() {

        @Override
        public void onClick(View v) {
            switch ( v.getId() ) {
                case R.id.play:{

                    Toast.makeText(getApplicationContext(),"hello",Toast.LENGTH_SHORT).show();
                    startService( new Intent( "com.example.leochens.servicetest.Music" ) );
                    break;
                }

                case R.id.stop:
                    stopService( new Intent( "com.example.leochens.servicetest.Music" ) );
                    break;

                default:
                    break;
            }

        }
    };
}