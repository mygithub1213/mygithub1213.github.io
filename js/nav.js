document.addEventListener("DOMContentLoaded", function(){
	const elems            = document.querySelector('.sidenav');
	const preLoaderContent = document.querySelector('.loader-content');
	const bodyContent      = document.querySelector("#body-content");
	let page               = window.location.hash.substr(1);

	if(page == "") page = "home";

	loadNav = () => {
		let xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = function(){
			if(this.readyState == 4) {
				if(this.status !== 200) return;

				document.querySelectorAll(".topnav, .sidenav").forEach(elm => {
					elm.innerHTML = xhttp.responseText;
				});

				document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
					elm.addEventListener("click", event =>{
						M.Sidenav.getInstance(elems).close();

						page = event.target.getAttribute("href").substr(1);
						loadPage(page);
					});
				});
			}
		}

		xhttp.open("GET", "nav.html", true);
		xhttp.send();
	}

	loadPage = page => {
		let xhttp = new XMLHttpRequest();

		bodyContent.innerHTML = '';
		preLoaderContent.classList.toggle('hide');

		xhttp.onreadystatechange = function() {
			if(this.readyState === 4) {
				preLoaderContent.classList.toggle('hide');

				if(page === "home") {
					getKlasmenLiga();
				} else if(page === "saved") {
					getSavedClubs();
				}

				if(this.status === 200) {
					bodyContent.innerHTML = xhttp.responseText;
				} else if(this.status === 404) {
					bodyContent.innerHTML = "<h4>Halaman tidak ditemukan</h4>";
				} else {
					bodyContent.innerHTML = "<h4>Upss.. Halaman tidak dapat diakses</h4>";
				}
			}
		}

		xhttp.open("GET", `pages/${page}.html`, true);
		xhttp.send();	
	}

	M.Sidenav.init(elems);
	loadPage(page);
	loadNav();
});