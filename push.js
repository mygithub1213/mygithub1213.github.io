var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BIEoivcV2ORvpFeF8OJH0AglV2mAWT74htv7MZiaxi6iHAnTbbqtYY-8RronZGp0elTUIxlR0nuNADkTwEvzQc4",
	"privateKey": "d9Ru0Fk-CUoPx5V5Tgc-NKXdQLf7YrvOBIRvfDGQ9Xs"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/cqJpyUEWmm4:APA91bFEUX5VftdyfqgFnAQTJ3tNdkxsJ2uE_ucy-mFvj0VIh6JiQV9pUP4w4eSE3KkzdrKtumLTo2UBfjCuovl3i_mGH9Cy_4XatXMWMxqLCZKJxJ-xMb-Z-iiMendTPz71AB1ix9ox",
	"keys": {
		"p256dh": "BIxSixmbePDl7umFBb2SkVh0xMRn8tljevhn/zjqcOTAyXyYgiOnPh3A2zMQ4wms4E4MWRfqPJYJcEN8vBH54Ug=",
		"auth": "jcpF0rmDZX69UEyAMl2wMw=="
	}
};

const payload = 'Notifikasi Terbaru';
 
const options = {
   gcmAPIKey: '922829385695',
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);