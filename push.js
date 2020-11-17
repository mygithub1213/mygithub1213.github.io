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
   "endpoint": "https://fcm.googleapis.com/fcm/send/fDs07FmPoHg:APA91bEND2FfFeW3hzhuDDFCsiIF8RHydvOLM8p4K06IqjE8rnzGWE78UBOyuibd7YLYFGw1vvGSamwI0PYKcYXcyNrnNGACG8VpuNo8DB8BKICgRolkqb8c4rOZDywNMJJ2jqhnF32V",
	"keys": {
		"p256dh": "BKmgMjvrkWxxUibiOKIJfGGEcxj/nnfRl92EMj74m/wtxHetEDaLkdrmqs4Wa9US33Ikr6m6glXbpiS+XW5UXDc=",
		"auth": "CC8+DhQStHdUkL4dfmBrkg=="
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