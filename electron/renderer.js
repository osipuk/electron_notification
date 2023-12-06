const { contextBridge, ipcRenderer,   }= require("electron");
const Notification=require("electron");
const electron=require("electron");
// this will end up on the window object in the react app (ie `window.electron.sendNotification()` )
// contextBridge.exposeInMainWorld("electron", {
//   isElectron: true, // if window.electron exists, it's electron, but lets include this as well
//   getFCMToken: (channel, func) => {
//     ipcRenderer.once(channel, func);
//     ipcRenderer.send("getFCMToken");
//   },
// });

// Listen for service successfully started
ipcRenderer.on('PUSH_RECEIVER:::START_NOTIFICATION_SERVICE', (_, token) => {console.log('FCM service started')})
// Start the service
ipcRenderer.on("PUSH_RECEIVER:::NOTIFICATION_SERVICE_STARTED", (_, token) => {console.log(token,'started token')})
// Handle notification errors
ipcRenderer.on("PUSH_RECEIVER:::NOTIFICATION_SERVICE_ERROR", (_, error) => {console.log(error)})
// Store the new token
ipcRenderer.on("PUSH_RECEIVER:::TOKEN_UPDATED", (_, token) => {
  const event = new CustomEvent('fcmTokenUpdated', { 
    payload: token
   });
  window.dispatchEvent(event);
})

// ipcRenderer.on("getFCMToken", (token)=>{
//   console.log(token,'this is token');
// });

// Display notification
ipcRenderer.on('PUSH_RECEIVER:::NOTIFICATION_RECEIVED', (_, serverNotificationPayload) => {
  
  if (serverNotificationPayload.notification.body){       
    ipcRenderer.send('showNotification', serverNotificationPayload); 
  } else {
    // payload has no body, so consider it silent (and just consider the data portion)
    console.log('do something with the key/value pairs in the data', serverNotificationPayload.data)
  }

  
});

// FCM sender ID from FCM console
const senderId = '24812515735'
ipcRenderer.send('PUSH_RECEIVER:::START_NOTIFICATION_SERVICE', senderId)