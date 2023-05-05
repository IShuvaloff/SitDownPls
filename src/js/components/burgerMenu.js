function burgerMenuProcess() {
  const burger = document.getElementById('burger');
  const burgerClose = document.getElementById('burger-close');

  burgerClose.addEventListener('click', (e) => {
    e.preventDefault();
    burgerMenuClose(e);
  })

  burger.addEventListener('click', (e) => {
    e.preventDefault();

    const burgerMenu = document.getElementById('burger-menu');
    burgerMenu.classList.add('absolute-visible');
    burgerMenu.classList.remove('transparent');

    e._burgerMenuOpened = true;
  });
}

function burgerMenuClose(e) {
  e._burgerMenuOpened = false;

  const burgerMenu = document.getElementById('burger-menu');
  burgerMenu.classList.add('transparent');
  setTimeout(() => {
    burgerMenu.classList.remove('absolute-visible');
  }, 200);
}
