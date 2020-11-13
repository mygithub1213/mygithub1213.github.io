urlBase64ToUint8Array = base64String => {
  	const padding = '='.repeat((4 - base64String.length % 4) % 4);
  	const base64 = (base64String + padding)
      	.replace(/-/g, '+')
      	.replace(/_/g, '/');
  	const rawData = window.atob(base64);
  	const outputArray = new Uint8Array(rawData.length);
  	for (let i = 0; i < rawData.length; ++i) {
      	outputArray[i] = rawData.charCodeAt(i);
  	}
  	return outputArray;
}

registerServiceWorker = () => {
	return navigator.serviceWorker
		.register("/service-worker.js")
		.then(registration => {
			console.log("Pendaftaran Service Worker Berhasil.");
			return registration;
		})
		.catch(err => {
			console.log("Pendaftaran Service Worker Gagal", err);
		});
}

requestPermission = () => {
	if ('Notification' in window) {
        Notification.requestPermission().then(function (result) {
          	if (result === "denied") {
            	console.log("Fitur notifikasi tidak diijinkan.");
            	return;
          	} else if (result === "default") {
            	console.error("Pengguna menutup kotak dialog permintaan ijin.");
            	return;
          	}
          
          	if (('PushManager' in window)) {
            	navigator.serviceWorker.getRegistration().then(function(registration) {
                	registration.pushManager.subscribe({
                    	userVisibleOnly: true,
                    	applicationServerKey: urlBase64ToUint8Array("BIEoivcV2ORvpFeF8OJH0AglV2mAWT74htv7MZiaxi6iHAnTbbqtYY-8RronZGp0elTUIxlR0nuNADkTwEvzQc4")
                	}).then(function(subscribe) {
                    	console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                    	console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                        	null, new Uint8Array(subscribe.getKey('p256dh')))));
                    	console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                        	null, new Uint8Array(subscribe.getKey('auth')))));
                	}).catch(function(e) {
                    	console.error('Tidak dapat melakukan subscribe ', e.message);
                	});
            	});
          	}
        });
    }
}

if("serviceWorker" in navigator) {
	window.addEventListener('load', function() {
		registerServiceWorker();
		requestPermission();
	});
} else {
	console.log("Service Worker belum didukung browser ini.")
}