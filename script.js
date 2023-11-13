const rootElement = document.querySelector("#root")

const fetchUrl = (url) => fetch(url).then(res => res.json())

const skeletonComponent = () => `
  <h1>Rick & Morty app</h1>
  <p id="selected-card"></p>
  <div class="characters"></div>
  <div class="buttons"></div>
`

const characterComponent = (characterData) => ` 
  <div class="char">
    <img src=${characterData.image}>
    <h2>${characterData.name}</h2>
    <h3>appears in: ${characterData.episode.length} episodes</h3>
  </div>
`

const selectedCharacterComponent = (characterData) => {
  let episodesArray = []

  characterData.episode.forEach(epUrl => {
    episodesArray.push(epUrl.substring(40))
  })

  return `
  <h2>${characterData.name}</h2>
  <h3>${characterData.status}</h3>
  <h4>${characterData.gender}</h4>
  <h5>${characterData.species}</h5>
  <h6>episodes: ${episodesArray.join(', ')}</h6>
`}

const buttonComponent = (id, text) => `<button id=${id}>${text}</button>`

const buttonEventComponent = (id, url) => {
  const buttonElement = document.querySelector(`#${id}`)
  buttonElement.addEventListener("click", () => {
    console.log(`fetch: ${url}`)
    rootElement.innerHTML = "LOADING..."
    fetchUrl(url).then(data => {
      makeDomFromData(data, rootElement)

      const selectedCharElement = document.querySelector("#selected-card")

      const charElements = document.querySelectorAll(".char")
      charElements.forEach(charElement => charElement.addEventListener("click", () => {
        const selectedName = charElement.querySelector("h2").innerText // pl. Rick Sanchez, Morty Smith, Abradolf Lincler
        const selectedChar = characterList.find((char) => char.name === selectedName)
        selectedCharElement.innerHTML = selectedCharacterComponent(selectedChar)
      }))
    })
  })
}

const makeDomFromData = (data, rootElement) => {
  rootElement.innerHTML = skeletonComponent()

  const charactersElement = document.querySelector(".characters")
  const buttonsElement = document.querySelector(".buttons")

  const info = data.info
  const characters = data.results

  characters.forEach(character => {
    charactersElement.insertAdjacentHTML("beforeend", characterComponent(character))
  })

  if (info.prev) {
    buttonsElement.insertAdjacentHTML("beforeend", buttonComponent("prev", `
      <span class="material-icons">arrow_back</span>
    `))
    buttonEventComponent("prev", info.prev)
  }

  if (info.next) {
    buttonsElement.insertAdjacentHTML("beforeend", buttonComponent("next", `
      <span class="material-icons">arrow_forward</span>
    `))
    buttonEventComponent("next", info.next)
  }
}

const init = () => {
  rootElement.innerHTML = "LOADING..."
  fetchUrl("https://rickandmortyapi.com/api/character").then(data => {
    makeDomFromData(data, rootElement)

    const selectedCharElement = document.querySelector("#selected-card")

    const charElements = document.querySelectorAll(".char")
    charElements.forEach(charElement => charElement.addEventListener("click", () => {
      const selectedName = charElement.querySelector("h2").innerText // pl. Rick Sanchez, Morty Smith, Abradolf Lincler
      const characterList = data.results
      const selectedChar = characterList.find((char) => char.name === selectedName)
      selectedCharElement.innerHTML = selectedCharacterComponent(selectedChar)
    }))
  })
}

init()