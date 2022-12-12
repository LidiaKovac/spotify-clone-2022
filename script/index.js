const albums = [
  "5327691",
  "363906907",
  "217489292",
  "359324967",
  "313482367",
  "65373012",
]


// ! ALL FETCHES
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
    let alert = document.querySelector(".alert strong")
    alert.innerText = error
    alert.parentElement.classList.add("show")
  }
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
    let alert = document.querySelector(".alert strong")
    alert.innerText = error
    alert.parentElement.classList.add("show")

  }
}

const fillJumboTron = async (query) => {
  try {
    let res = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=" + query
    )
    let { data: songs } = await res.json()
    let { album, title, artist, preview } = songs[0]

    populateElement("img.adv__cover", "src", album.cover_big)
    populateElement(".adv__info h2", "innerText", title)
    populateElement(".adv__info p:first-of-type", "innerText", artist.name)
    populateElement(".adv__info p:first-of-type", "onclick", ()=> window.location.assign(`/artist.html?id=${artist.id}`))
    
    populateElement(".adv__info p:nth-of-type(2)", "innerText", album.title)
    populateElement(".adv__info p:nth-of-type(2)", "onclick", ()=> window.location.assign(`/album.html?id=${album.id}`))

    let playBtnJt = document.querySelector(".adv__button.play-btn")
    playBtnJt.addEventListener("click", () => {
      setupPlayer(title, artist.name, preview, album.cover_big)
    })
  } catch (error) {
    let alert = document.querySelector(".alert strong")
    alert.innerText = error
    alert.parentElement.classList.add("show")

  }
}

const populateElement = (elementQuery, prop, value) => {
  let elementToPop = document.querySelector(elementQuery)
  elementToPop[prop] = value
}

// ! Rendering functions

const createRecentCard = (album) => {
  let recentContainer = document.querySelector(".recent__container .recent")
  recentContainer.innerHTML += `
  <div class='col col-xs-12 col-sm-6 col-xxl-4 g-3'> 
    <div
    class="recent__card d-flex flex-row g-0" onclick="setupPlayer('${album.tracks.data[0].title}', '${album.artist.name}', '${album.tracks.data[0].preview}', '${album.cover_medium}')"
  >
    <img class="recent__card-img " src="${album.cover_medium}" />
    
    <a class="recent__card-title  text-truncate text-white my-auto fw-bold " href='./album.html?id=${album.id}'> 
      ${album.title}
    </a>
    
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
     `
  })
}



// ! Player functions


// ! onload

window.onload = async () => {
  await Promise.all([
    fetchSongs(),
    searchSongs("pinguini tattici nucleari", "favorites"),
    searchSongs("Chorus Line", "liked"),
    searchSongs("High School Musical Cast", "shows"),
    fillJumboTron("abcdef  you"),
  ])
  // await fetchSongs()
  // await searchSongs("pinguini tattici nucleari")
  // await fillJumboTron("abcdef  you")
}
