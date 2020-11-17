const baseUrl    = "https://api.football-data.org";
const myApiToken = "62b0628c95454f678a905331fbd1145e";

const ligaInggris        = 2021;
const klasmenLigaInggris = `${baseUrl}/v2/competitions/${ligaInggris}/standings`;
const detailKlub         = `${baseUrl}/v2/teams`;

const defaultImg = "icons/ideal_logo_192x192.png";

const options = {
	headers: {
		'X-Auth-Token': myApiToken
	}
}

status = (response) => {
	if(response.status === 200) {
		return Promise.resolve(response);
	} else {
		console.log(`Error: ${response.status}`);
		return Promise.reject(new Error(response.statusText));
	}
}

json = (response) => {
	return response.json();
}

error = (error) => {
	console.log(`Error: ${error}`);
}

fnInnerHTML = (selector, dataHTML) => {
	document.getElementById(selector).innerHTML = dataHTML;
}

crestUrlTeam = crestUrl => {
	if(crestUrl !== null) {
		crestUrl = replaceHttpToHttps(crestUrl);
	}

	return crestUrl;
}

replaceHttpToHttps = string => {
	return string.replace(/^http:\/\//i, 'https://');
}

getKlasmenLiga = () => {
	if('caches' in window) {
		caches.match(klasmenLigaInggris).then(response => {
			if(response) {
				response.json().then(data => {
					const { standings } = data;
					appendKlasmen(standings);
				})
			}
		});
	}

	fetch(klasmenLigaInggris, options)
		.then(status)
		.then(json)
		.then((data) => {
			const { standings } = data;		
			appendKlasmen(standings);
		})
		.catch(error);
}

appendKlasmen = standings => {
	const { table } = standings[0];
	let rowsTable   = '';

	table.forEach(item => {
		const urlDetail = `./klub.html?id=${item.team.id}`;
		const clubImage = crestUrlTeam(item.team.crestUrl);

		rowsTable += `
			<tr>
				<td>${item.position}</td>
				<td>
					<div class="ib-nama-klub">
						<img src="${clubImage}" class="mx-2" alt="Image of ${item.team.name}" width="25" onError="this.onerror=null;this.src='${defaultImg}';">
						<div><a href="${urlDetail}">${item.team.name}</a></div>
					</div>
				</td>
				<td>${item.playedGames}</td>
				<td>${item.won}</td>
				<td>${item.draw}</td>
				<td>${item.lost}</td>
				<td>${item.points}</td>
			</tr>
		`;

	});

	fnInnerHTML("tabelKlasmen", rowsTable);
}

getKlubById = () => {
	return new Promise((resolve, reject) => {
		const urlParams = new URLSearchParams(window.location.search);
		const idParam   = urlParams.get("id");
		const urlDetail = `${detailKlub}/${idParam}`;

		if("caches" in window) {
			caches.match(urlDetail).then(response => {
				if(response) {
					response.json().then(klub => {
						appendClub(klub);
						initMyTabs();
						resolve(klub);
					});
				}
			})
		}

		fetch(urlDetail, options)
			.then(status)
			.then(json)
			.then(klub => {
				appendClub(klub);
				initMyTabs();

				resolve(klub);
			});
	});
}

getSavedKlubById = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const idParam   = urlParams.get("id");
	  
	getById(idParam).then(klub => {
		appendClub(klub);   
	});
}

appendClub = klub => {
	if(klub === undefined) return;
	
	const { squad, activeCompetitions } = klub;
	let daftarPemain    = '';
	let daftarKompetisi = '';

	const email     = klub.email ? klub.email : '-';
	const noTelepon = klub.phone ? klub.phone : '-';
	const clubImage = crestUrlTeam(klub.crestUrl);

	squad.forEach(pemain => {
		daftarPemain += `
			<div class="col s12 m6">
				<div class="card">
					<div class="card-content">
						<span class="card-title">${pemain.name}</span>
						<div>Kewarganegaraan: ${pemain.nationality}</div>
						<div>Peran: ${pemain.role}</div>
						<div>Posisi: ${pemain.position}</div>
					</div>
				</div>
			</div>`;
	});

	activeCompetitions.forEach(kompetisi => {
		daftarKompetisi += `
			<div class="col s12 m6">
				<div class="card">
					<div class="card-content">
						<span class="card-title">${kompetisi.name}</span>
						<div>Area: ${kompetisi.area.name}</div>
					</div>
				</div>
			</div>`;
	});

	const klubHTML = `
		<div class="row">
			<div class="col m12 mb-3">
				<div class="mb-3 px-3 ib-b-left-active">
					<h4>${klub.name}</h4>
				</div>
			</div>
			<div class="col m3 mb-3">
				<img src="${clubImage}" class="responsive-img mb-3" alt="Image of ${klub.name}" onError="this.onerror=null;this.src='${defaultImg}';">

				<div>
					<label>Nama Klub</label>
					<div>${klub.name}</div>
				</div>
				<div>
					<label>Alamat</label>
					<div>${klub.address}, ${klub.area.name}</div>
				</div>
				<div>
					<label>Email</label>
					<div>${email}</div>
				</div>
				<div>
					<label>Tahun Berdiri</label>
					<div>${klub.founded}</div>
				</div>
				<div>
					<label>No. Telepon</label>
					<div>${noTelepon}</div>
				</div>
				<div>
					<label>Stadion</label>
					<div>${klub.venue}</div>
				</div>
				<div>
					<label>Website</label>
					<div>${klub.website}</div>
				</div>
			</div>
			<div class="col m9 px-3">
				<div class="row p-3">
				    <div class="col s12">
				      <ul class="tabs">
				        <li class="tab col s3"><a class="active" href="#pemain">Pemain</a></li>
				        <li class="tab col s3"><a href="#kompetisi-aktif">Kompetisi Aktif</a></li>
				      </ul>
				    </div>
				    <div id="pemain" class="col s12">
				    	<div class="row p-3">${daftarPemain}</div>
				    </div>
				    <div id="kompetisi-aktif" class="col s12">
				    	<div class="row p-3">${daftarKompetisi}</div>
				    </div>
				</div>
  			</div>
		</div>
	`;

	fnInnerHTML("body-content", klubHTML);
}

initMyTabs = () => {
	const myTabs = document.querySelector(".tabs");
	M.Tabs.init(myTabs, options);
}

getSavedClubs = () => {
	getAll().then(klubs => {
		let klubFavorit = "";

		if(klubs.length === 0) {
			klubFavorit += `<p class="center">Tidak ada klub favorit :(</p>`;
		} else {
			klubs.forEach(klub => {
				const clubImage = crestUrlTeam(klub.crestUrl);

				klubFavorit += `
					<div class="col s12 m6">
						<div class="card">
							<a href="./klub.html?id=${klub.id}&saved=true">
								<div class="card-image waves-effect waves-block waves-light">
									<img src="${clubImage}" alt="Image of ${klub.name}"  onError="this.onerror=null;this.src='${defaultImg}';">
								</div>
							</a>

							<div class="card-content">
								<span class="card-title">${klub.name}</span>
								<button id="${klub.id}" class="removeClub waves-effect waves-light btn-small red lighten-1">Hapus</button>
							</div>
						</div>
					</div>
				`;
			});
		}

		fnInnerHTML("savedClubs", klubFavorit);
		fnRemoveClub();
	});
}

fnRemoveClub = () => {
	let removeClub = document.querySelectorAll(".removeClub");

   	removeClub.forEach(button => {
       	button.addEventListener("click", function (event) {
           	const clubId = parseInt(event.target.id);

          	deleteClub(clubId).then(() => {
               	getSavedClubs();
          		M.toast({html: 'Klub favorit berhasil di hapus'});
           	});
       	});
   	});
}