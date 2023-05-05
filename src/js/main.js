(() => {
  document.addEventListener('DOMContentLoaded', (e) => {

    recordsProcess();
    dottedProcess();

    dottedProcess('.dotted-str p');

    // инициализация бургер-меню
    burgerMenuProcess();
    // инициализация селектов с регионами
    branchesProcess();
    // инициализация селектов с категориями
    categoriesProcess();
    // инициализация свайпера с баннерами
    bannerProcess();
    // инициализация свайпера со спецпредложениями
    offersProcess();
    // инициализация свайпера с полезным
    goodProcess();
    // инициализация блока с заявками
    requestsProcess();
    // инициализация каталога
    catalogProcess();
    // инициализация страницы с продуктом
    productProcess();
    // инициализация модальных окон
    modalsProcess();

  });
})()
