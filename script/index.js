const albums = [
  "5327691",
  "363906907",
  "217489292",
  "359324967",
  "313482367",
  "65373012",
]

const playlistNames = [
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
]
let interval //this will be the interval moving the indicator
const playButton = document.querySelector(".player .play-btn")

const fetchSongs = async () => {
  try {
    for (const albumId of albums) {
      let res = await fetch(
        `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`
      )
      let album = await res.json()
      createRecentCard(album)
    }
  } catch (error) {
    console.log(error)
  }
}

const createRecentCard = (album) => {
  let recentContainer = document.querySelector(".recent__container .recent")
  recentContainer.innerHTML += `
  <div class='col col-xs-12 col-sm-6 col-xxl-4 g-3'> 
    <div
    class="recent__card d-flex flex-row g-0" onclick="setupPlayer('${album.tracks.data[0].title}', '${album.artist.name}', '${album.tracks.data[0].preview}', '${album.cover_medium}')"
  >
    <img class="recent__card-img " src="${album.cover_medium}" />
    <div
      class="recent__card-title  text-truncate text-white my-auto fw-bold "
    >
      ${album.title}
    </div>
    <div class="recent__card-player-button text-center my-auto d-none d-lg-block">
      <button class="text-center" >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-play-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"
          />
        </svg>
      </button>
    </div>
  </div>
  </div>
    `
}

const setupPlayer = (title, artist, preview, cover) => {
  //! FASE DI RESET: 
  let playerIndicator = document.querySelector(".player__progress-indicator")
  let counter = 1
  //* reset dell'interval (il conto ricomincia da capo)
  clearInterval(interval)
  //* reset del css (l'indicatore torna a inizio player)
  playerIndicator.style.left = "0px"
  //* creazione nuovo interval
  interval = setInterval(() => {
    playerIndicator.style.left = `${Math.round((counter * 100) / 30)}%`
    console.log(counter)
    counter++
    if (counter === 31) {
      clearInterval(interval)
    }
  }, 1000)
  const playerTrackname = document.querySelector(".player__track-title")
  const playerArtistname = document.querySelector(".player__track-artist")
  const playerCover = document.querySelector(".player__track-cover")
  const playerAudio = document.querySelector(".player audio")

  playerTrackname.innerText = title
  playerArtistname.innerText = artist
  playerAudio.src = preview
  playerAudio.volume = 0.1
  playerAudio.play()
  toggleMusic()
  playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"/>
  </svg>`
  playerCover.src = cover
}

const searchSongs = async (query, container) => {
  try {
    const favContainer = document.querySelector(`.${container}__results`)
    document.querySelector(`.${container}__container`).innerText = query
    let res = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=" + query
    )
    let { data: music } = await res.json()
    //rimuovo le canzoni di natale (lol), mescolo l'array e lo taglio ai primi 7 elementi
    let clean = music.sort(() => (Math.random() > 0.5 ? 1 : -1)).slice(0, 6)
    console.log(clean)
    renderSearchResults(clean, favContainer)
  } catch (error) {
    console.log(error)
  }
}

const renderSearchResults = (songs, container) => {
  // title, artist, preview, cover

  songs.forEach((song, i) => {
    container.innerHTML += `
    <div class=' col ${
      i > 3 ? "d-none" : ""
    } col-xs-6 col-sm-3 col-md-3 col-xl-2 d-xl-block'> 
      <div class='song__card' onclick="setupPlayer('${song.title}', '${
      song.artist.name
    }', '${song.preview}', '${song.album.cover_big}')"> 
        <img class='song__card-cover' src='${song.album.cover_medium}'/> 
        <div class='song__card-title mt-1 text-truncate fw-bold text-white'>  
        ${song.title}
        </div>
        <div class='song__card-artist text-light-grey text-truncate'>
          ${song.artist.name}
        </div>
      </div> 
     </div>
     `
  })
}

const fillJumboTron = async (query) => {
  try {
    let res = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=" + query
    )
    let { data: songs } = await res.json()
    console.log(songs)
    let advCover = document.querySelector("img.adv__cover")
    let advTitle = document.querySelector(".adv__info h2")
    let advAlbum = document.querySelectorAll(".adv__info p")
    let playBtnJt = document.querySelector(".adv__button.play-btn")
    let { album, title, artist, preview } = songs[0]
    advCover.src = album.cover_big
    advTitle.innerText = title
    advAlbum[0].innerText = artist.name
    advAlbum[1].innerText = album.title
    playBtnJt.addEventListener("click", () => {
      setupPlayer(title, artist.name, preview, album.cover_big)
    })
  } catch (error) {
    console.log(error)
  }
}

const toggleMusic = () => {
  const playerAudio = document.querySelector(".player audio")
  if (playerAudio.readyState > 0) {
    const isPlaying = playerAudio.duration > 0 && !playerAudio.paused
    console.log(playerAudio.duration)
    console.log(isPlaying)
    if (!isPlaying) {
      console.log("this is pause")
      clearInterval(id)
      // playerAudio.pause()
      playButton.innerHTML = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-play-circle-fill"
    viewBox="0 0 16 16"
  >
    <path
      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"
    />
  </svg>`
    } else {
      console.log("this is play")

      // playerAudio.play()
      playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"/>
  </svg>`
    }
  }
}

const handlePlay = () => {
  console.log("m")
  const playerAudio = document.querySelector(".player audio")

  const isPlaying = playerAudio.duration > 0 && !playerAudio.paused
  if (isPlaying) {
    playerAudio.pause()
  } else playerAudio.play()
  toggleMusic()
}

const loadPlaylist = () => {
  const playlistContainer = document.querySelector(".playlist__area")
  playlistNames.forEach((playlist) => {
    playlistContainer.innerHTML += `
    <div class="playlist__single px-4 py-2 align-items-center text-light-grey text-truncate" >
    ${playlist}
  </div>
    `
  })
}

window.onload = async () => {
  await Promise.all([
    fetchSongs(),
    searchSongs("pinguini tattici nucleari", "favorites"),
    searchSongs("Chorus Line OST", "liked"),
    searchSongs("High School Musical Cast", "shows"),
    fillJumboTron("abcdef  you"),
  ])
  // await fetchSongs()
  // await searchSongs("pinguini tattici nucleari")
  // await fillJumboTron("abcdef  you")
  loadPlaylist()
}
