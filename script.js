const rootElement = document.querySelector("#root")

const fetchUrl = (url) => fetch(url).then(res => res.json())

const characterComponent = (characterData) => ` 
  <div class="char">
    <img src=${characterData.image}>
    <h2>${characterData.name}</h2>
    <h3>appears in: ${characterData.episode.length} episodes</h3>
  </div>
`

const buttonComponent = (id, text) => `<`



const makeDomFromData = (data, rootElement) => {
  const info = data.info // info object
  const characters = data.results // characters array

  characters.forEach(character => rootElement.insertAdjacentHTML("beforeend", characterComponent(character)))
}

const init = () => {
  fetchUrl("https://rickandmortyapi.com/api/character").then(data => makeDomFromData(data, rootElement))
}

init()