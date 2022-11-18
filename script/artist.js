let url = new URLSearchParams(location.search)
let id = url.get("id")
window.onload = async () => {
  if(!id) window.location.assign("/index.html")
  await fetchArtist(id)
  await fetchTracks(id)
  await filterPopular()
}

const fetchArtist = async (id) => {
  try {
    let res = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/artist/" + id
    )
    let artist = await res.json()
    populateElement(".artist__header img", "src", artist.picture_xl)
    populateElement("h1", "innerText", artist.name)
    populateElement(
      ".monthly__listeners span.listeners",
      "innerText",
      artist.nb_fan
    )
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

const fetchTracks = async (id) => {
  try {
    let res = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/artist/" +
        id +
        "/top?limit=50"
    )
    let { data: tracks } = await res.json()
    let trackContainer = document.querySelector(".artist__popular-tracks")
    tracks.forEach((song, i) => {
      trackContainer.innerHTML += `
    <div onclick="setupPlayer('${song.title}', '${song.artist.name}', '${
        song.preview
      }', '${
        song.album.cover_big
      }')" class="artist__track-single text-white row justify-content-between align-items-center my-2 w-100">
                    <div class="single__track-number col-1">${i + 1}</div>
                    <img src="${
                      song.album.cover_xl
                    }" class="single__track-cover p-0 col-1 " />

                    <div class="single__track-title col-4">${song.title}</div>
                    <div class="single__track-views col-3">${song.rank}</div>
                    <div class="single__track-duration text-end col-3 d-none d-lg-block">${(
                      song.duration / 60
                    ).toFixed(2)}</div>


                </div> `
    })
  } catch (error) {
    console.log(error)

    let alert = document.querySelector(".alert strong")
    alert.innerText = error
    alert.parentElement.classList.add("show")
  }
}

const moveActive = (target) => {
  for (const el of target.parentElement.children) {
    el.classList.remove("option--active")
  }
  target.classList.add("option--active")
}

const filterPopular = async (
  target = document.querySelector(".discography__option-single.popular")
) => {
  try {
    moveActive(target)
    let res = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/artist/" +
        id +
        "/top?limit=50"
    )
    let { data: tracks } = await res.json()
    if (tracks.length <= 0) {
      await filterAlbums()
      let popularTitle = document.querySelector("h2.pop-title")
      popularTitle.remove()
      let popularSection = document.querySelector(".artist__popular-tracks")
      popularSection.remove()
      throw new Error("No songs!")
    }
    let sorted = tracks.sort((a, b) => a.rank - b.rank)
    let popular = []
    sorted.forEach((song) => {
      if (!popular.map((a) => a.title).includes(song.album.title)) {
        popular.push(song.album)
      }
    })
    popular = popular.slice(0, 4)
    renderOption(popular, sorted[0].artist.name)
  } catch (error) {
    console.log(error)

    let alert = document.querySelector(".alert strong")
    alert.innerText = error
    alert.parentElement.classList.add("show")
  }
}

const renderOption = (arrayOfAlbums, artistName) => {
  let popContainer = document.querySelector(".option__container")
  popContainer.innerHTML = ""
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
       `
  })
}

const filterAlbums = async (
  target = document.querySelector(".discography__option-single.albums")
) => {
  try {
    moveActive(target)

    let artistName = document.querySelector("h1").innerText
    let res = await fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=" + artistName
    )
    let { data: songs } = await res.json()
    let allAlbums = songs
      .filter((song) => song.artist.name === artistName)
      .map((song) => song.album)
    let uniqueAlbums = []
    allAlbums.forEach((album) => {
      if (!uniqueAlbums.map((a) => a.title).includes(album.title)) {
        uniqueAlbums.push(album)
      }
    })

    renderOption(uniqueAlbums, artistName)
  } catch (error) {
    let alert = document.querySelector(".alert strong")
    alert.innerText = error
    alert.parentElement.classList.add("show")
  }
}
