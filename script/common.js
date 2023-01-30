const playlistNames = [
  "Be The Young Seasons 1-5",
  "Be The Young Seasons 6-8",
  "persona di m*rda (gen-feb 2023)",
  "Musical 2022",
  "pippo, pluto e paperino (nov-dec 2022)",
  "early stage emily syndrome (sett-ott 2022)",
  "Be the young",
  "'...' cit. Kimiko (lug-ago 2022)",
  "saggio vibes 💃🩰",
  "main character energy (mag-giu 2022)",
  "that fucking mood 🔪☠️",
  "VEE, CARLOTTA E GIACOMO VANNO A BOSIO",
  "An Emily Winchester kind of mood 🔪🖕",
  "landing page (mar-apr 2022)",
  "2021 lol",
  "cosa cazzo vuol dire questa affermazione (gen-feb 2022)",
  "honey and glass (nov-dic 2021)",
  "(Revenge) Training Arc 🦍",
  "Lidia 🤝 Emily",
  "minecraft e nintendo switch (sep-oct 2021)",
  "silvano d'orba? I hardly know her (lug - ago 2021)",
  "Culo 2021",
  "Frah Quintale Mix",
  "Francesco Guccini Mix",
  "Lo Stato Sociale Mix",
  "chapter 4/? (mag-giu 2021)",
  "Strive School <> The Hunt Motivation",
  "mi stavo dimenticando (mar-apr 2021)",
  "high school musical 1,2,3",
  "quanto trash cazzo",
  "The 2020 Playlist",
  "ma(ncanza) che cazzo ne so io (gen-feb 2021)",
];

let interval; //qui salveremo l'intervallo che gestira' lo scorrimento della musica
const playButton = document.querySelector(".player .play-btn");

//!CREA TUTTE LE PLAYLSIT NELLA SIDEBAR PARTENDO DA UN ARRAY STATIC
const loadPlaylist = () => {
  const playlistContainer = document.querySelector(".playlist__area");
  playlistNames.forEach((playlist) => {
    playlistContainer.innerHTML += `
      <div class="playlist__single clickable px-4 py-2 align-items-center text-light-grey text-truncate" >
      ${playlist}
    </div>
      `;
  });
};

//!NASCONDE GLI ALERT DI ERRORI ONCLICK
const hideAlert = (ev) => {
  ev.target.parentElement.classList.remove("show");
};

//!INIZIALIZZA UN INTERVAL DA UN SECONDO
//funzione chiamata ogni volta che il player deve ricominciare a muoversi
const startInterval = (curr, counter, target) => {
  interval = setInterval(() => {
    //salviamo l'interval in una variabile per poterlo cancellare (==fermare) in
    target.value = curr + counter; //cambia il valore dell'input al valore dell'input + il tempo trascorso
    console.log(curr + counter);
    counter++; //aumenta il contatore dei secondi trascorsi
    console.log(Number(target.value) > 30);
    if (target.value == 30) {
      //se il valore dell'input e' a 30 la canzone e' finita
      clearInterval(interval); //cancella l'interval
      target.value = 0; //resetta l'input a 0 (inizio barra)
    }
  }, 1000); //ogni secondo
};

//!GESTISCE LA BARRA DI PROGRESSO
//chiama onchange sull'input type range
const handleProgressBar = (event) => {
  let curr = Number(event.target.value);
  populateElement(".player audio", "currentTime", event.target.value); //cambia la posizione della canzone in base al valore dell'input
  clearInterval(interval); //resetta l'intervallo
  let counter = 1; //inizia a contare il tempo trascorso da 1
  startInterval(curr, counter, event.target); //chiama la funzione che inizializza l'intervallo
};

//!GESTISCE L'INIZIO e IL RESET DEGLI INTERVALLI
//chiamata quando viene cambiata canzone nel player
const handleInterval = (action) => {
  //
  let input = document.querySelector("input[type='range'].player__progress-bar");
  let curr = Number(input.value);
  let counter = 1;
  if (action === "reset") {
    //* reset dell'interval (il conto ricomincia da capo)
    clearInterval(interval);
    counter = 0;
    //* reset dell'input (l'indicatore torna a inizio player)
    input.value = 0;
  } else if (action === "start") {
    //* creazione nuovo interval
    startInterval(curr, counter, input);
  } else if (action === "pause") {
    clearInterval(interval);
  }
};

//!INSERISCE I DATI DELLA CANZONE PASSATA COME PARAMETRO NEL PLAYER
const setupPlayer = (title, artist, preview, cover) => {
  //inserisce dati della canzone nella barra del player e gestisce scorrimento barra

  populateElement(".player__track-title", "innerText", title);
  populateElement(".player__track-artist", "innerText", artist);
  populateElement(".player__track-cover", "src", cover);
  populateElement(".player audio", "src", preview);
};

//!GESTISCE I PULSANTI PLAY / PAUSA A LIVELLO GRAFICO
const toggleMusic = (action) => {
  if (action == "pausa") {
    playButton.innerHTML = `<i class="bi bi-play-circle-fill"> </i>`;
  } else {
    playButton.innerHTML = `<i class="bi bi-pause-circle-fill">
    </i>`;
  }
};

//!RITORNA VERO SE LA MUSICA E' IN PLAY O FALSO SE LA MUSICA E' IN PAUSA
const isAudioPlaying = () => {
  const player = document.querySelector(".player audio");
  console.log(player.src, player.paused);
  return player.src && !player.paused; //se l'audio e' settato e il player non e' in pausa
};

//!FUNZIONE PRINCIPALE DEL PLAYER!!
//CHIAMATA ONCLICK SUI PULSANTI PLAY E SULLE CARD
//parametri:
// titolo, artista, preview e cover, come default hanno gli stessi valori presi dal DOM
// in questo modo se chiamo la funziona senza parametri (per esempio con la canzone impostata di default, i valori non saranno undefined)
const handlePlay = (
  title = document.querySelector(".player__track-title").innerText,
  artist = document.querySelector(".player__track-artist").innerText,
  preview = document.querySelector(".player audio").src,
  cover = document.querySelector(".player__track-cover").src
) => {
  const player = document.querySelector(".player audio"); //il player audio
  const isPlaying = isAudioPlaying(); //VERO se la musica sta andando, FALSO se e' in pausa
  if (document.querySelector(".player .player__track-title").innerText !== title) {
    //se i titoli sono diversi allora sono due canzoni diverse
    // questo if potrebbe essere migliorato controllando anche un secondo parametro, in caso di canzoni con lo stesso nome
    setupPlayer(title, artist, preview, cover);
    handleInterval("reset"); //se e' una nuova canzone vogliamo resettare la barra del player a 0
    handleInterval("start"); // e poi ricominciare a scorrere
    toggleMusic("play"); //cambia il pulsante da play a pausa

    player.play(); //fa partire la musica
  } else {
    //se e' la stessa canzone di prima
    if (isPlaying) {
      //se la musica e' in corso
      toggleMusic("pausa"); //cambiamo il pulsante da pausa a play
      handleInterval("pause");
      player.pause(); //mettiamo in pausa la musica
    } else {
      handleInterval("start"); //facciamo ripartire la barra progresso da dove e' rimasta

      player.play(); //riparte la musica
      toggleMusic("play"); //cambia il pulsante da play a pausa
    }
  }
};

//! GESTISCE IL VOLUME DEL PLAYER
//CHIAMATA ONCHANGE SULL'INPUT RANGE DEL VOLUME
const handleVolume = (event) => {
  const playerAudio = document.querySelector(".player audio");
  playerAudio.volume = Number(event.target.value) / 100;
};

//!FUNZIONI CHIAMATE AL CARICAMENTO
loadPlaylist(); //crea le playlist nella sidebar
