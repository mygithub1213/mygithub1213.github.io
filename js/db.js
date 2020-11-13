const dbPromise = idb.open("ideal-bola", 1, upgradeDb => {
	if (! upgradeDb.objectStoreNames.contains('klubs')) {
        let klubsObjectStore = upgradeDb.createObjectStore("klubs", {keyPath: "id"});

        klubsObjectStore.createIndex("name", "name", { unique: false });
    }
});

saveForLater = klub => {
	return new Promise((resolve, reject) => {
		dbPromise
			.then(db => {
				const transaction = db.transaction("klubs", `readwrite`);
	            transaction.objectStore("klubs").put(klub);
	            return transaction;
			})
			.then(transaction => {
				transaction.complete ? resolve(true) : reject(new Error(transaction.onerror));
			});
	});	
}

getAll = () => {
	return new Promise((resolve, reject) => {
		dbPromise
			.then(db => {
				const transaction = db.transaction("klubs", "readonly");
				return transaction.objectStore("klubs").getAll();
			})
			.then(klubs => {
				klubs === undefined ? reject(new Error("Tidak ada klub favorit")) : resolve(klubs);
			});
	});
}

getById = id => {
  return new Promise(function(resolve, reject) {
    dbPromise
      .then(db => {
        const transaction = db.transaction("klubs", "readonly");
        return transaction.objectStore("klubs").get(id);
      })
      .then(klubs => {
        resolve(klubs);
      });
  });
}

deleteClub = clubId => {
    return new Promise((resolve, reject) => {
        dbPromise.then(db => {
            const transaction = db.transaction("klubs", `readwrite`);
            transaction.objectStore("klubs").delete(clubId);
            return transaction;
        }).then(transaction => {
            transaction.complete ? resolve(true) : reject(new Error(transaction.onerror));
        });
    });
};