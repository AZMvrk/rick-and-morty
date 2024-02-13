const rootElement = document.querySelector("#root")

const fetchUrl = (url) => fetch(url).then(res => res.json())


const skeletonComponent = () => `
  <h1 style="
    display: flex;
    justify-content: center;
    padding: 1rem;
    border-bottom: 2px solid #17a2b8; 
    margin: 1rem;
    color: #17a2b8;
    ">Rick & Morty characters
  </h1>

  <div class="characters" 
    style="
      display: flex; 
      justify-content: center; 
      gap: 20px; 
      flex-wrap: wrap;
    ">
  </div>
  <div class="buttons" 
    style="
      position: static; 
      bottom: 0; 
      display: flex; 
      justify-content: center; 
      max-width: 98vw;
      margin: 0 auto;
      margin-top: 1rem; 
      border-top: 2px solid #17a2b8;
      padding: 1rem;
      gap: 1rem; 
    ">
  </div>
`

const characterComponent = (characterData) => {
  return `
    <div class="card text-center border-light character-card" 
      style="
        max-width: 15rem; 
        cursor: pointer;" 

        data-character-id="${characterData.id}">

      <img src=${characterData.image} class="card-img-top" alt="${characterData.name}">
      <div class="card-body text-info">
        <h5 class="card-title">${characterData.name}</h5>
      </div>
    </div>
  `
}

function createModal() {
  const modalHTML = `
    <div id="characterModal" class="modal" style="display: none;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="color: #17a2b8;">Character Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="modalCharacterContent">
            <!-- Character details will be inserted here -->
          </div>
        </div>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML('beforeend', modalHTML)
}



const selectedCharacterComponent = (characterData) => {
  let episodesArray = []

  characterData.episode.forEach(epUrl => {
    episodesArray.push(epUrl.substring(40))
  })

  return `
  <img src=${characterData.image} class="card-img-top" alt="${characterData.name}">
  <h2 style="display: flex; justify-content: center; margin: 0.5rem;">${characterData.name}</h2>
  <ul>
    <li>Species: ${characterData.species}</li>
    <li>Origin: ${characterData.origin.name}</li>
    <li>Gender: ${characterData.gender}</li>
    <li>Location: ${characterData.location.name}</li>
    <li>Status: ${characterData.status}</li>
  </ul>
  `
  //<p>Episodes: ${episodesArray.join(', ')}</p>
}

const buttonComponent = (id, text) => `<button id=${id} class="btn btn-outline-info">${text}</button>`

const buttonEventComponent = (id, url) => {
  const buttonElement = document.querySelector(`#${id}`)
  buttonElement.addEventListener("click", () => {

    console.log(`fetch: ${url}`)

    rootElement.innerHTML = "LOADING..."
    fetchUrl(url)
      .then(data => {
      makeDomFromData(data, rootElement)
    })
  })
}


function showModal(characterData) {
  const modalElement = document.getElementById('characterModal')
  const modalContent = document.getElementById('modalCharacterContent')

  modalContent.innerHTML = selectedCharacterComponent(characterData)

  // using bootstrap's modal javascript class to handle the modal
  let modal = new bootstrap.Modal(modalElement)
  modal.show()
}

const makeDomFromData = (data, rootElement) => {

  rootElement.innerHTML = skeletonComponent()

  const charactersElement = document.querySelector(".characters")
  const buttonsElement = document.querySelector(".buttons")

  const info = data.info
  const characters = data.results

  characters.forEach(character => {
    charactersElement.insertAdjacentHTML("beforeend", characterComponent(character))
  });


  document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', () => {
      const characterId = card.getAttribute('data-character-id')
      const characterData = characters.find(c => c.id.toString() === characterId)
      if (characterData) {
        showModal(characterData)
      }
    })
  })


  if (info.prev) {
    buttonsElement.insertAdjacentHTML("beforeend", buttonComponent("prev", `<span class="material-icons">arrow_back</span>`))
    buttonEventComponent("prev", info.prev)
  }

  if (info.next) {
    buttonsElement.insertAdjacentHTML("beforeend", buttonComponent("next", `<span class="material-icons">arrow_forward</span>`))
    buttonEventComponent("next", info.next)
  }
}


const init = () => {
  rootElement.innerHTML = "LOADING..."
  createModal()


  fetchUrl("https://rickandmortyapi.com/api/character")
    .then(data => {
      makeDomFromData(data, rootElement)
    })
}


init()