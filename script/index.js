const albums = ["365432517", "363906907", "308643687", "359324967", "441750887", "65373012"];

const APIurl = "https://striveschool-api.herokuapp.com/api/deezer";

//* FETCH:

//! FETCHA GLI ALBUM NELL'ARRAY
//CHIAMATA ONLOAD
const fetchSongs = async () => {
  try {
    for (const albumId of albums) { //equivalente di forEach, ma forEach ha bisogno di un callback che dovrebbe a sua volta asincrona
      //per evitare problemi di sballamento dell'ordine delle operazioni usiamo un for normale
      //Sarebbe andato bene anche un for con i :) 
      let res = await fetch(`${APIurl}/album/${albumId}`);
      let album = await res.json();
      createRecentCard(album); //renderizza gli album nella sezione "buon pomeriggio", vedi sotto
    }
  } catch (error) {
    let alert = document.querySelector(".alert strong");
    alert.innerText = error;
    alert.parentElement.classList.replace("d-none", "show");

  }
};

//!FETCHA IN BASE ALLA QUERY E RENDERIZZA IN UN CONTAINER SPECIFICO
//CHIAMATA ON LOAD (=> e' possibile riutilizzare questa funzione per una pagina di ricerca)
const searchSongs = async (query, container) => {
  try {
    const chosenContainer = document.querySelector(`.${container}__results`); //nella pagina ci sono tre "row" con lo stesso schema di classi CSS
    //la prima riga e' favorites__results
    //la seconda riga e' shows__results
    //la terza riga e' liked__results
    //in questo modo posso passare la sezione in cui voglio mettere le mie canzoni come parametro e riutilizzare la stessa funzione per le tre righe
    populateElement(`.${container}__container`, "innerText", query); //stessa cosa per favorites__container, shows__container e liked__container,
    //che contengono la parte "variabile" del titolo della riga
    //NB: populateElement prende come parametri un selettore CSS, una proprieta' e un valore, vedi sotto
    let res = await fetch(`${APIurl}/search?q=${query}`);
    let { data: music } = await res.json(); //decostruzione della risposta
    let clean = music
      //tengo solo le canzoni dello stesso artista per pulire un po' i risultati
      .filter((song) => song.artist.name.toLowerCase() === query.toLowerCase())
      //ordina per rank
      .sort((a, b) => b.rank - a.rank)
      //prendi solo le prime 6 canzoni
      .slice(0, 6);
    renderSearchResults(clean, chosenContainer); //renderizzo le canzoni filtrate, ordinate e tagliate nel contenitore che passo come parametro
  } catch (error) {
    let alert = document.querySelector(".alert strong");
    alert.innerText = error;
    alert.parentElement.classList.replace("d-none", "show");

  }
};

//!RENDERIZZA IL JUMBOTRON
const fillJumboTron = async (query) => {
  //la funzione searchSongs non puo' essere usata anche se usa lo stesso endpoint perche' la struttura del dom da riempire e' diversa
  try {
    let res = await fetch(`${APIurl}/search?q=${query}`);
    let { data: songs } = await res.json(); //prendo la prop "data" e la chiamo "songs"
    let { album, title, artist, preview } = songs[0]; //solo le info che mi servono dal PRIMO risultato
    //doppia decostruzione => const [primoRisultato:{album, title, artist, preview}] = song

    populateElement("img.adv__cover", "src", album.cover_big);
    //NB: populateElement prende come parametri un selettore CSS, una proprieta' e un valore, vedi sotto

    populateElement(".adv__info h2", "innerText", title);
    populateElement(".adv__info p:first-of-type", "innerText", artist.name);
    populateElement(".adv__info p:first-of-type", "onclick", () => window.location.assign(`/artist.html?id=${artist.id}`));

    populateElement(".adv__info p:nth-of-type(2)", "innerText", album.title);
    populateElement(".adv__info p:nth-of-type(2)", "onclick", () => window.location.assign(`/album.html?id=${album.id}`));
    populateElement(".adv__button.play-btn", "onclick", () => handlePlay(title, artist.name, preview, album.cover_big));
  } catch (error) {
    let alert = document.querySelector(".alert strong");
    alert.innerText = error;
    alert.parentElement.classList.replace("d-none", "show");

  }
};

//!FUNZIONE RIUTILIZZABILE PER SETTARE UN CERTO VALORE I UNA CERTA PROPRIETA' IN UNO SPECIFICO ELEMENTO DEL DOM
const populateElement = (elementQuery, prop, value) => {
  let elementToPop = document.querySelector(elementQuery);
  elementToPop[prop] = value;
};

// FUNZIONI DI RENDERING:

//!CREA LE CARD DELLA SEZIONE "BUON GIORNO"
//PARAMETRO: un aggetto album
const createRecentCard = (album) => {
  let recentContainer = document.querySelector(".recent__container .recent");
  recentContainer.innerHTML += `
  <div class='col col-xs-12 col-sm-6 col-xxl-4 g-3'> 
    <div
    class="recent__card d-flex flex-row g-0" onclick="handlePlay('${album.tracks.data[0].title}', '${album.artist.name}', '${album.tracks.data[0].preview}', '${album.cover_medium}')"
  >
    <img class="recent__card-img " src="${album.cover_medium}" />
    
    <a class="recent__card-title  text-truncate text-white my-auto fw-bold " href='./album.html?id=${album.id}'> 
      ${album.title}
    </a>
    
    <div class="recent__card-player-button text-center my-auto d-none d-lg-block">
      <button class="text-center" >
        <i class="bi bi-play-fill"></i>
      </button>
    </div>
  </div>
  </div>
    `;
};

//!RENDERIZZA UN ARRAY (songs) IN UN CONTAINER PASSATO COME PARAMETRO
const renderSearchResults = (songs, container) => {
  //nota! Qui container non e' un selettore ma l'elemento del DOM stesso

  songs.forEach((song, i) => {
    container.innerHTML += `
    <div class=' col ${i > 3 ? "d-none" : ""} col-xs-6 col-sm-3 col-md-3 col-xl-2 d-xl-block'> 
      <div class='song__card' onclick="handlePlay('${song.title}', '${song.artist.name}', '${song.preview}', '${
      song.album.cover_big
    }')"> 
        <img class='song__card-cover' src='${song.album.cover_medium}'/> 
        <div class='song__card-title mt-1 text-truncate fw-bold text-white'>  
        <a href='./album.html?id=${song.album.id}'> 
        ${song.title} 
        </a>
        </div>
        <div class='song__card-artist text-light-grey text-truncate'>
        <a href='./artist.html?id=${song.artist.id}'> 
          ${song.artist.name}
        </a>
        </div>
      </div> 
     </div>
     `;
  });
};

// !FUNZIONI CHIAMATE ONLOAD

window.onload = async () => {
  await Promise.all([
    fetchSongs(),
    searchSongs("billie eilish", "favorites"),
    searchSongs("pinguini tattici nucleari", "liked"),
    searchSongs("bruce springsteen", "shows"),
    fillJumboTron("everything i wanted billie eilish"),
  ]);
};
