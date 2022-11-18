window.onload = async () => {
  let url = new URLSearchParams(window.location.search)
  let id = url.get("id")
  if(!id) window.location.assign("/index.html")

  await fetchAlbum(id)
}
const getDurationString = (seconds) => {
  let hoursNum = seconds / 60 / 60
  let stringHours = hoursNum.toFixed(2).toString()
  let hours = stringHours.split(".")[0]
  let minutes = Math.round((hoursNum - Number(hours)) * 60).toString()
  console.log(minutes)
  return `${hours} ore ${minutes} min`
}

// Non è una soluzione comprensiva di tutte le lettere con umlaut o diacritici, ma è la più vicina a cui sono potuta arrivare.
// Chiaramente si potrebbero passare molte altre lettere come la ñ o la ç.
const replaceDiacritics = (string) => {
  return string
    .toLowerCase()
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replaceAll("ü", "u")
}

const fetchArtist = async (query) => {
  try {
    let res = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=" +
        replaceDiacritics(query)
    )
    let { data: songs } = await res.json()
    console.log(songs[0].artist.name.toLowerCase(), query)
    let allAlbums = songs
      .filter((song) => song.artist.name.toLowerCase() === query.toLowerCase())
      .map((song) => song.album)
    let uniqueAlbums = []
    allAlbums.forEach((album) => {
      if (!uniqueAlbums.map((a) => a.title).includes(album.title)) {
        uniqueAlbums.push(album)
      }
    })
    renderRelated(uniqueAlbums)
  } catch (error) {
    let alert = document.querySelector(".alert strong")
    alert.innerText = error
    alert.parentElement.classList.add("show")
  }
}

const renderRelated = (arrayOfAlbums) => {
  console.log(arrayOfAlbums)
  let relatedContainer = document.querySelector(".album__related")
  arrayOfAlbums.forEach((album) => {
    relatedContainer.innerHTML += `<div onclick="location.assign('./album.html?id=${album.id}')" class='col 
      col-xs-6 col-sm-4 col-md-3 col-xl-3 d-xl-block'> 
        <div class='song__card'> 
          <img class='song__card-cover' src="${album.cover_medium}"/> 
          <div class='song__card-title mt-1 text-truncate fw-bold text-white'>  
          <a href='/album.html?id=${album.id}'> 
          ${album.title} 
          </a>
          </div>
          
        </div> 
       </div>
       `
  })
}

const fetchAlbum = async (id) => {
  try {
    let res = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/album/" + id
    )
    let album = await res.json()
    populateElement(
      ".album__bg",
      "style",
      `background-image: url("${album.cover_xl}")`
    )
    populateElement(".album__cover", "src", album.cover_xl)
    populateElement("h1", "innerText", album.title)
    populateElement("span.album__related-title", "innerText", album.title)

    populateElement(".album__type", "innerText", album.record_type)
    populateElement(
      ".artist__info img.artist__pic",
      "src",
      album.artist.picture_xl
    )
    populateElement(
      ".artist__info .artist__name",
      "innerText",
      album.artist.name
    )
    populateElement(
      ".artist__info .artist__name",
      "href",
      `/artist.html?id=${album.artist.id}`
    )

    populateElement(
      ".artist__info .album__year",
      "innerText",
      album.release_date.split("-")[0]
    )
    populateElement(
      ".artist__info .album__track-number",
      "innerText",
      album.nb_tracks + " brani"
    )
    populateElement(
      ".artist__info .album__duration",
      "innerText",
      getDurationString(album.duration)
    )

    if (album.tracks.data) {
      if (album.tracks.data.length <= 0) throw new Error("No songs!")
      else {
        populateTracks(album.tracks.data)
        await fetchArtist(album.contributors[0].name)
      }
    }
  } catch (error) {
    console.log(error)
    let alert = document.querySelector(".alert strong")
    alert.innerText = error
    alert.parentElement.classList.add("show")
  }
}

const populateElement = (elementQuery, prop, value) => {
  let elementToPop = document.querySelector(elementQuery)
  elementToPop[prop] = value
}
const replaceQuotes = (string) => {
  return string.replaceAll("'", "ʼ").replaceAll('"', "ˮ")
}

const populateTracks = (tracks) => {
  let tracksCont = document.querySelector(".album__tracks")
  tracks.forEach((track, i) => {
    tracksCont.innerHTML += `<div onclick='setupPlayer("${replaceQuotes(
      track.title
    )}", "${replaceQuotes(track.artist.name)}", "${track.preview}", "${
      track.album.cover_big
    }")' class="tracks__table-single clickable mx-3 py-3 row justify-content-between text-white">
    <div class="col-1">${i + 1}</div>
    <div class="col-5 text-truncate">${track.title_short}</div>
    <div class="col-4">${track.rank}</div>
    <div class="col-1">${(track.duration / 60).toFixed(2)}</div>
</div>`
  })
}
