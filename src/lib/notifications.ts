"use client";

// Utility to handle cross-platform notifications (Windows Web & Capacitor Mobile)
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
}

export async function showLocalNotification(title: string, body: string) {
  const granted = await requestNotificationPermission();
  
  if (granted) {
    // Show native Windows/Mac web notification
    new Notification(title, {
      body,
      icon: "/favicon.ico", // A cute Pico icon would go here
    });
    
    // In a Capacitor mobile environment, you would call:
    // await LocalNotifications.schedule({
    //   notifications: [{ title, body, id: 1 }]
    // });
  } else {
    console.warn("Notification permission not granted.");
  }
}
