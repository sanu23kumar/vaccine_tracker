/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.foregroundservice;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;

import static com.voximplant.foregroundservice.Constants.INTERVAL;
import static com.voximplant.foregroundservice.Constants.NOTIFICATION_CONFIG;

public class VIForegroundService extends Service {
    private Handler taskHandler = new android.os.Handler();
    private int delay = 1000 * 60 * 15;

    private Runnable repetitiveTaskRunnable = new Runnable() {
        public void run() {
            Log.d("FOREGROUND_CENTRES", "run: starting service");
            Intent service = new Intent(getApplicationContext(), ForegroundCentresService.class);
            Bundle bundle = new Bundle();

            bundle.putString("foo", "bar");
            service.putExtras(bundle);
            getApplication().startService(service);
            HeadlessJsTaskService.acquireWakeLockNow(getApplicationContext());
            startHandler();
        }
    };

    void startHandler() {
        taskHandler.postDelayed(repetitiveTaskRunnable, delay);
    }

    void stopHandler() {
        taskHandler.removeCallbacks(repetitiveTaskRunnable);
    }


    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onRebind(Intent intent) {
        super.onRebind(intent);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent.getAction();
        if (action != null) {
            if (action.equals(Constants.ACTION_FOREGROUND_SERVICE_START)) {
                if (intent.getExtras() != null && intent.getExtras().containsKey(NOTIFICATION_CONFIG)) {
                    Bundle notificationConfig = intent.getExtras().getBundle(NOTIFICATION_CONFIG);
                    delay = notificationConfig.getInt(INTERVAL, delay);
                    startHandler();
                    if (notificationConfig != null && notificationConfig.containsKey("id")) {
                        Notification notification = NotificationHelper.getInstance(getApplicationContext())
                                .buildNotification(getApplicationContext(), notificationConfig);

                        startForeground((int)notificationConfig.getDouble("id"), notification);
                    }
                }
            } else if (action.equals(Constants.ACTION_FOREGROUND_SERVICE_STOP)) {
                stopHandler();
                stopSelf();
            }
        }
        return START_NOT_STICKY;

    }
}