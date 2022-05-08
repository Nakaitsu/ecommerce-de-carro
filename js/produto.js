let produtoDB

$(document).ready( () => {
  $.getJSON('js/produto.json', data => {
    produtoDB = data
    main()
  })
  .fail( () => alert('Esse página precisa ser acessada com o live server do VS CODE para acessar o arquivo JSON') )
})

const main = () => {
  "use strict"

  let filteredContent = 'initial'
  randomContent()
  
  document.querySelectorAll('.filtro-div')
    .forEach( element => element.addEventListener( 'click', function(event) {
      event.preventDefault()
    
      document.querySelectorAll('.filtro-div i')
        .forEach( i => i.className = 'bi-square' )

      this.children[0].classList.remove('bi-square')
      this.children[0].classList.add('bi-check-square-fill')

      let selectedFilter = this.children[1].children[0].textContent.toLowerCase()

      if ( !toggleFilter(selectedFilter, filteredContent) ) {
        this.children[0].className = 'bi-square'
        filteredContent = 'random'
        
        randomContent()
        toggleCardsButtons()
        enableBuy()
        
      } else {
        filteredContent = selectedFilter
      }
    
  }))  
  
  toggleCardsButtons()
  enableBuy()
}

const enableBuy = () => {
  document.querySelectorAll('.btn-comprar')
    .forEach( button => button.addEventListener('click', function() {
      let produto = this.closest('.cartao-produto').dataset.id
      let marca = this.closest('.cartao-produto').dataset.marca

      sessionStorage.clear()
      sessionStorage.setItem('produto', produto)
      sessionStorage.setItem('marca', marca)
    }))
}

const generateNewCard = (carsObject) => {
  const card = document.createElement('section')
  let description = formatDesctription(carsObject.descricao)
  
  let cardContent = `
    <div class="ilustracao">
      <button data-botao="voltar">
        <i class="bi-chevron-compact-left"></i>
      </button>

      <img src="${carsObject.imagens[0]}" alt="imagem do produto">

      <button data-botao="avançar">
        <i class="bi-chevron-compact-right"></i>
      </button>
    </div>
  
    <div class="informacao">
      <h4>${carsObject.nome}</h4>
      <p class="preco-produto">Por apenas<span>$ ${carsObject.preco}</span></p>
      <p class="descricao-produto">${description}</p>
      <a href="compra.html" class="btn btn-rounded btn-comprar">Comprar</a>
    </div>
  `
  const temp = carsObject.imagens[0].split('/')
  const marca = temp[2]
  
  card.dataset.id = carsObject.nome
  card.dataset.marca = marca
  card.className = 'cartao-produto'
  card.innerHTML = cardContent
  
  return card
}

const toggleCardsButtons = () => {
  document.querySelectorAll('.ilustracao > button')
    .forEach( button => button.addEventListener( 'click', function() {
      let cardID = this.closest('.cartao-produto').dataset.id,
          move,
          imageSource,
          newImagePath

      if(this.dataset.botao === 'avançar') {
        imageSource = this.previousElementSibling
          .getAttribute('src')

        move = 1
        newImagePath = getNewImage(imageSource, cardID, move)

        this.previousElementSibling
          .setAttribute('src', newImagePath)
      }
      else if(this.dataset.botao === 'voltar') {
        imageSource = this.nextElementSibling
          .getAttribute('src')

        move = -1
        newImagePath = getNewImage(imageSource, cardID, move)

        this.nextElementSibling
          .setAttribute('src', newImagePath)
      }

    }))
}

const getNewImage = (imageURL, cardID, moveDirection) => {
  let imageRoot = imageURL.split('/'),
      imageResponse

  produtoDB.forEach(element => {
    if(element.marca == imageRoot[2]) {
      const cars = element.veiculos
      const carIndex = cars.findIndex(veiculo => veiculo.nome === cardID)
      const imageDB = cars[carIndex].imagens
      let imageIndex = imageDB.indexOf(imageURL)
      const move = imageIndex + moveDirection 

      if (move == imageDB.length) {
        imageIndex = 0
      }
      else if (move < 0) {
        imageIndex = imageDB.length - 1
      }
      else {
        switch (moveDirection) {
          case 1:
            imageIndex++
            break
          case -1:
            imageIndex--
            break
        }
      }

      let imageQueryResult = imageDB[imageIndex]
      imageResponse = imageQueryResult
    }
  })

  return imageResponse
}

const toggleFilter = (newFilter, currentFilter) => {
  if (currentFilter !== newFilter) {
    currentFilter = newFilter
    
    painelProdutoClear()

    produtoDB.forEach(produto => { 
      if (produto.marca === currentFilter) {   
        produto.veiculos.forEach( veiculo => {
          let card = generateNewCard(veiculo)

          painelProdutoAppend(card)
        })

        toggleCardsButtons()
        enableBuy()
      }
    })

    return true
  }
  else if (currentFilter === newFilter) {
    return false
  }

}

const randomContent = () => {
  painelProdutoClear()

  let carsToShow = []

  while(carsToShow.length <= 7){
    let randomIndex = -1,
        randomPicker = -1
    
    randomIndex = Math.floor(Math.random() * produtoDB.length)
    randomPicker = Math.floor(Math.random() * produtoDB[randomIndex].veiculos.length)
    
    let carRandom = produtoDB[randomIndex].veiculos[randomPicker]
    
    if (carsToShow.findIndex(chosenCar => chosenCar.nome === carRandom.nome) === -1)
      carsToShow.push(carRandom)
  }
  
  carsToShow.forEach(car => {
    let card = generateNewCard(car)
    painelProdutoAppend(card)
  })
}

const formatDesctription = description => {
  return description.toString().replaceAll( '.,' , '.<br>')
}

const painelProdutoAppend = HTMLelement => {
  document.querySelector('.painel-produtos').append(HTMLelement)
}

const painelProdutoClear = () => {
  document.querySelector('.painel-produtos').innerHTML = ""
}