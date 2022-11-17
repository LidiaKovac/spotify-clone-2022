window.onload = async() => {
    let url = new URLSearchParams(location.search)
    let id = url.get("id")
    await fetchArtist(id)
}

const fetchArtist = async (id) => {
    let res = await fetch("https://striveschool-api.herokuapp.com/api/deezer/artist/" + id)
    let artist = await res.json()
    let coverImage = document.querySelector(".artist__header img")
    coverImage.src = artist.picture_xl
}