const main = () =>{
  const banners = document.querySelectorAll('.home-banner')
  let bannerAtual = 0

  setInterval( () => {
    fadeOut(banners[bannerAtual])
    bannerAtual = (bannerAtual + 1) % 2
    fadeIn(banners[bannerAtual])
  }, 6500)
}

function fadeIn(target) {
  target.classList.remove('hide')
  target.classList.add('show')
}

function fadeOut(target) {
  target.classList.remove('show')
  target.classList.add('hide')
}

window.onload = main