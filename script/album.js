window.onload = async () => {
  let url = new URLSearchParams(window.location.search)
  let id = url.get("id")
  if(!id) window.location.assign("/index.html")

  await fetchAlbum(id)
}

//!CONERTE LA DURATA IN SECONDI IN ORE E MINUTI
const getDurationString = (seconds) => {
  let hoursNum = seconds / 60 / 60
  let stringHours = hoursNum.toFixed(2).toString()
  let hours = stringHours.split(".")[0]
  let minutes = Math.round((hoursNum - Number(hours)) * 60).toString()
  console.log(minutes)
  return `${hours} ore ${minutes} min`
}


//!ELIMINA LE LETTERE CON DIACRITICI E RITORNA LETTERE "BASE"
// Non è una soluzione comprensiva di tutte le lettere con umlaut o diacritici, ma è la più vicina a cui sono potuta arrivare.
// Chiaramente si potrebbero passare molte altre lettere come la ñ o la ç, inserendole semplicemente in altri .replaceAll()
const replaceDiacritics = (string) => {
  return string
    .toLowerCase()
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replaceAll("ü", "u")
    //ritorna la stringa con le lettere sostituite
}

const fetchArtist = async (id) => {
  try {
    let res = await fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50` //Cerchiamo l'artista per id
    )
    let { data: songs } = await res.json() //isolo la proprieta' "data"
    let allAlbums = songs
      .map((song) => song.album) //creo un array dei soli album 
      .filter((album)=> album.title.toLowerCase() !== document.querySelector("h1").innerText.toLowerCase()) //elimino l'album della pagina che stiamo vedendo
    let uniqueAlbums = []
    allAlbums.forEach((album) => { //creiamo un array di album unici
      if (!uniqueAlbums.map((a) => a.title).includes(album.title)) {
        uniqueAlbums.push(album)
      }
    })
    renderRelated(uniqueAlbums) //rendering degli album
  } catch (error) {
    let alert = document.querySelector(".alert strong")
    alert.innerText = error
    alert.parentElement.classList.add("show")
  }
}

//!RENDERIZZA LA RIGA DI ALBUM "related" IN FONDO ALLA PAGINA
const renderRelated = (arrayOfAlbums) => {
  let relatedContainer = document.querySelector(".album__related")
  if(arrayOfAlbums.length === 0) {
    relatedContainer.parentElement.children[1].remove()
  }
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
        await fetchArtist(album.contributors[0].id)
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
    tracksCont.innerHTML += `<div onclick='handlePlay("${replaceQuotes(
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
