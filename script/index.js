const albums = [
  "5327691",
  "363906907",
  "217489292",
  "359324967",
  "313482367",
  "65373012",
]

const fetchSongs = async () => {
  for (const albumId of albums) {
    let res = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`
    )
    let album = await res.json()
    createRecentCard(album)
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
  const playerTrackname = document.querySelector(".player__track-title")
  const playerArtistname = document.querySelector(".player__track-artist")
  const playerAudio = document.querySelector(".player audio")
  const playerCover = document.querySelector(".player__track-cover")

  playerTrackname.innerText = title
  playerArtistname.innerText = artist
  playerAudio.src = preview
  playerAudio.volume = 0.1
  playerAudio.play()
  playerCover.src = cover
}

const searchSongs = async (query) => {
  const favContainer = document.querySelector(".favorites__container")
  favContainer.innerText = query
  let res = await fetch(
    "https://striveschool-api.herokuapp.com/api/deezer/search?q=" + query
  )
  let { data: music } = await res.json()
  //rimuovo le canzoni di natale (lol), mescolo l'array e lo taglio ai primi 7 elementi
  let clean = music
  .sort(() => Math.random() > 0.5 ? 1 : -1)
  .slice(0, 7)
  console.log(clean)
  renderSearchResults(clean)
}

const renderSearchResults = (songs) => {
  let favRow = document.querySelector(".favorites__results")
  songs.forEach((song) => {
    favRow.innerHTML += `
    <div class='song__card'> 
    <img class='song__card-cover' src='${song.album.cover_medium}'/> 
    <div class=' song__card-title text-white'>  
    ${song.title}
    </div>
    <div class='song__card-artist text-grey'>
      ${song.artist.name}
    </div>
     </div>
     `
  })
}

window.onload = async () => {
  await fetchSongs()
  await searchSongs("pinguini tattici nucleari")
}
