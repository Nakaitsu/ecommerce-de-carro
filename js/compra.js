const main = database => {
  let produto = sessionStorage.getItem('produto') 
  let marca = sessionStorage.getItem('marca')
  
  document.title += `: ${produto}`

  let nomeCarro = document.querySelector('#carro')
  let marcaCarro = document.querySelector('#marca')
  let precoCarro = document.querySelector('#preco')
  let imgCarro = document.querySelector('#img-produto')
  let btnCompra = document.querySelector('#comprar')

  btnCompra.addEventListener('click', () => {
    alert('compra feita com sucesso')
  })

  database.forEach(element => {
    if(element.marca == marca) {
      element.veiculos.forEach(veiculo => {
        if(veiculo.nome == produto){
          nomeCarro.setAttribute('value', produto)
          marcaCarro.setAttribute('value', marca)
          precoCarro.setAttribute('value', veiculo.preco)
          imgCarro.setAttribute('src', veiculo.imagens[0])
        }
      })
    }
  });
  
}

$(document).ready(() => {
  $.getJSON('js/produto.json', data => {
    main(data)
  })
    .fail(() => alert('Esse página precisa ser acessada com o live server do VS CODE para acessar o arquivo JSON'))
})