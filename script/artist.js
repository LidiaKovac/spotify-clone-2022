let url = new URLSearchParams(location.search); //prende i parametri di ricerca dall'URL della pagina
let id = url.get("id"); // da localhost:5500/artist.html?id=125 => 125
window.onload = async () => {
  if (!id) window.location.assign("/index.html"); //SE NON C'E' UN ID NELL'URL, rispedisci l'utente nella home
  Promise.all([fetchArtist(id), fetchTracks(id), filterPopular()]); //spacchetta i dati solo dopo che tutte le promise sono state eseguite
  //prendi tutti i dati dell'artista
  //prendi tutte le tracce dell'artista
  //filtra per popolari
};
const APIUrl = "https://striveschool-api.herokuapp.com/api/deezer";

//!FETCH ARTISTA PER ID 
const fetchArtist = async (id) => {
  try {
    let res = await fetch(`${APIUrl}/artist/${id}`); //fetcha dati artista per id (=> id proviene dall'URL vedi inizio file)
    let artist = await res.json();

    //inserisce nome artista, immagine di copertina e numero di fan
    populateElement(".artist__header img", "src", artist.picture_xl);
    populateElement("h1", "innerText", artist.name);
    populateElement(".monthly__listeners span.listeners", "innerText", artist.nb_fan);
  } catch (error) {
    let alert = document.querySelector(".alert strong");
    alert.innerText = error;
    alert.parentElement.classList.replace("d-none", "show");

  }
};


//!STESSA FUNZIONA DI INDEX JS
const populateElement = (elementQuery, prop, value) => {
  let elementToPop = document.querySelector(elementQuery);
  elementToPop[prop] = value;
};

//!FETCHA LE PRIME 50 CANZONI DELL'ARTISTA NELL'ID
const fetchTracks = async (id) => {
  try {
    let res = await fetch(`${APIUrl}/artist/${id}/top?limit=50`);
    let { data: tracks } = await res.json();
    let trackContainer = document.querySelector(".artist__popular-tracks");
    tracks.forEach((song, i) => {
      //per ogni canzone crea una nuova riga nella tabella della canzoni
      trackContainer.innerHTML += `
    <div onclick="handlePlay('${song.title}', '${song.artist.name}', '${song.preview}', '${
        song.album.cover_big
      }')" class="artist__track-single text-white row justify-content-between align-items-center my-2 w-100">
        <div class="single__track-number col-1">${i + 1}</div>
        <img src="${song.album.cover_xl}" class="single__track-cover p-0 col-1 " />
        <div class="single__track-title col-4">${song.title}</div>
        <div class="single__track-views col-3">${song.rank}</div>
        <div class="single__track-duration text-end col-3 d-none d-lg-block">${(song.duration / 60).toFixed(2)}</div>
     </div> `;
    });
    //inseriamo la prima canzone nel player premendo sul pulsante "play in cima alla pagina"
    populateElement(".artist__play-button", "onclick", () =>
      handlePlay(tracks[0].title, tracks[0].artist.name, tracks[0].preview, tracks[0].album.cover_big)
    );
  } catch (error) {
    let alert = document.querySelector(".alert strong");
    alert.innerText = error;
    alert.parentElement.classList.replace("d-none", "show");

  }
};

//!GESTISCE LE OPZIONI DELLA SEZIONE "DISCOGRAFIA"
const moveActive = (target) => { 
  //quando clicchiamo sulle opzioni cambia lo sfondo
  for (const el of target.parentElement.children) { // tutti i genitori del target (div con pulsanti)
    el.classList.remove("option--active"); 
  }
  target.classList.add("option--active"); //
};


//!GESTISCE
const filterPopular = async (target = document.querySelector(".discography__option-single.popular")) => {
  try {
    moveActive(target);
    let res = await fetch(`${APIUrl}/artist/${id}/top?limit=50`); //fetcha le prima 50 (o meno) canzoni dell'artista
    let { data: tracks } = await res.json();
    if (tracks.length === 0) { //se non ci sono tracce nei risultati
      let popularTitle = document.querySelector("h2.pop-title"); 
      popularTitle.remove();//elimina titolo "popolari"
      let popularSection = document.querySelector(".artist__popular-tracks"); 
      popularSection.remove();//elimina tabella "popolari"
      throw new Error("No songs!"); //lancia errore
    } 
    let sorted = tracks.sort((a, b) => a.rank - b.rank); //mette in ordine le canzoni per opolarita'
    let popular = [];
    sorted.forEach((song) => { //per ogni canzone
      if (!popular.map((a) => a.title).includes(song.album.title)) { //se il titolo della canzone non e' gia' nell'array
        popular.push(song.album); //inserisci la canzone nell'array
      } //questo if crea un'array di canzoni da album unici (senza doppioni)
    });
    popular = popular.slice(0, 4); //taglia da 0 a 4 canzoni
    renderOption(popular); //
  } catch (error) {
    console.log(error);

    let alert = document.querySelector(".alert strong");
    alert.innerText = error;
    alert.parentElement.classList.replace("d-none", "show");
  }
};

const renderOption = (arrayOfAlbums) => {
  let popContainer = document.querySelector(".option__container");
  popContainer.innerHTML = "";
  arrayOfAlbums.forEach((album) => {
    popContainer.innerHTML += `<div onclick="location.assign('./album.html?id=${album.id}')" class='col 
      col-xs-6 col-sm-4 col-md-3 col-xl-3 d-xl-block'> 
        <div class='song__card'> 
          <img class='song__card-cover' src='${album.cover_medium}'/> 
          <div class='song__card-title mt-1 text-truncate fw-bold text-white'>  
            <a href='/album.html?id=${album.id}'> 
            ${album.title} 
            </a>
          </div>
        </div> 
       </div>
       `;
  });
};


//!RITORNA TUTTI GLI ALBUM PRESENTI NEI RISULTATI DELLA RICERCA
const filterAlbums = async (target = document.querySelector(".discography__option-single.albums")) => { 
  try {
    moveActive(target);

    let artistName = document.querySelector("h1").innerText;
    let res = await fetch(`${APIUrl}/search?q=${artistName}`);
    let { data: songs } = await res.json();
    let allAlbums = songs.filter((song) => song.artist.name === artistName).map((song) => song.album);
    let uniqueAlbums = [];
    allAlbums.forEach((album) => {
      if (!uniqueAlbums.map((a) => a.title).includes(album.title)) {
        uniqueAlbums.push(album);
      }
    });
    renderOption(uniqueAlbums, artistName);
  } catch (error) {
    let alert = document.querySelector(".alert strong");
    alert.innerText = error;
    alert.parentElement.classList.replace("d-none", "show");

  }
};
