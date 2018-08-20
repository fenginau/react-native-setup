
package com.reactlibrary;

import android.content.Intent;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class RNVideoModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    public RNVideoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNVideo";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map < String, Object > constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }
    @ReactMethod
    public void show(String token, Callback successCallback, Callback errorCallback) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            Intent intent = new Intent(context, VideoActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra("TWILIO_TOKEN", token);
            context.startActivity(intent);
            successCallback.invoke();
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }


    }

    @ReactMethod
    public void showToast(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }
}