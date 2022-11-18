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

const loadPlaylist = () => {
    const playlistContainer = document.querySelector(".playlist__area")
    playlistNames.forEach((playlist) => {
        playlistContainer.innerHTML += `
      <div class="playlist__single clickable px-4 py-2 align-items-center text-light-grey text-truncate" >
      ${playlist}
    </div>
      `
    })
}

const hideAlert = (ev) => {
    ev.target.parentElement.classList.remove("show")
}

const handleProgressBar = (event) => {
    let curr = Number(event.target.value)
    populateElement(".player audio", "currentTime", event.target.value)
    document.querySelector(".player audio").play()
    clearInterval(interval)
    let counter = 1
    interval = setInterval(() => {
        event.target.value = curr + counter
        console.log(curr + counter)
        counter++
        if (Math.ceil(curr + counter) > 30) {
            clearInterval(interval)
        }
    }, 1000)
}
const handlePlayerBar = (event) => {
    console.log({ t: event.target.offsetWidth })
    const playerAudio = document.querySelector(".player audio")

    let clickedPoint = Math.ceil(event.layerX)
    let totalBarWidth = Math.ceil(event.target.offsetWidth)
    let percentage = (clickedPoint * 100) / totalBarWidth
    event.target.parentElement.children[1].style.left = percentage + "%"
    event.target.value = percentage
    clearInterval(interval)

    let counter = 1
    let moveMusicTo = (percentage * playerAudio.duration) / 100
    console.log(moveMusicTo)
    clearInterval(interval)

    playerAudio.currentTime = moveMusicTo
    counter = moveMusicTo + 1
    interval = setInterval(() => {
        event.target.value = Math.ceil((counter * 100) / playerAudio.duration)
        console.log(Math.ceil((counter * 100) / playerAudio.duration))
        counter++
        if (Math.ceil(counter) === Math.ceil(playerAudio.duration)) {
            clearInterval(interval)
        }
    }, 1000)
}

const setupPlayer = (title, artist, preview, cover) => {
    //! FASE DI RESET:
    let counter = 1
    const playerAudio = document.querySelector(".player audio")
    playerAudio.pause()
    //* reset dell'interval (il conto ricomincia da capo)
    clearInterval(interval)
    //* reset del css (l'indicatore torna a inizio player)
    //* creazione nuovo interval
    let input = document.querySelector("input[type='range']")
    input.value = 0
    let curr = input.value
    interval = setInterval(() => {
        input.value = curr + counter
        console.log(curr + counter)
        counter++
        if (Math.ceil(curr + counter) > 30) {
            clearInterval(interval)
        }
    }, 1000)
    
    populateElement(".player__track-title", "innerText", title)
    populateElement(".player__track-artist", "innerText", artist)
    populateElement(".player__track-cover", "src", cover)
    populateElement(".player audio", "src", preview)
    populateElement(".player audio", "volume", 0.1)

    playerAudio.play()
    toggleMusic()
    playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"/>
    </svg>`
}

const toggleMusic = () => {
    const playerAudio = document.querySelector(".player audio")
    if (playerAudio.readyState > 0) {
        const isPlaying = playerAudio.duration > 0 && !playerAudio.paused
        console.log(playerAudio.duration)

        console.log(isPlaying)
        if (!isPlaying) {
            console.log("this is pause")
            clearInterval(interval)
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
    const playerAudio = document.querySelector(".player audio")

    const isPlaying = playerAudio.duration > 0 && !playerAudio.paused
    if (isPlaying) {
        playerAudio.pause()
    } else playerAudio.play()
    toggleMusic()
}

const handleVolume = (event) => {
    const playerAudio = document.querySelector(".player audio")
    playerAudio.volume = event.target.value / 100
}

loadPlaylist()
let homeButton = document.querySelector(".menu__area .menu__single")
homeButton.addEventListener("click", () => {
    location.assign("/index.html")
})


let closeAlertBtns = document.querySelector("button.btn-close")
closeAlertBtns.addEventListener("click", hideAlert)