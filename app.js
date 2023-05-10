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

function bannerProcess() {
  const banner = new Swiper('.banner', {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    pagination: {
      el: '.banner__pagination',
      type: 'bullets',
      clickable: true,
      bulletClass: 'banner__pagination-bullet',
      bulletActiveClass: 'banner__pagination-bullet--active'
    },
  });
}

function branchesProcess() {
    // регионы
    const branches = document.querySelectorAll('.branches__list');
    branches.forEach(branch => {
      const choices = new Choices(branch, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        allowHTML: true,
        // position: 'down',
        choices: [
          { value: 'Москва', label: 'Москва', selected: true, disabled: false },
          { value: 'Казань', label: 'Казань' },
          { value: 'Уфа', label: 'Уфа' },
          { value: 'Пермь', label: 'Пермь' },
        ],
      });
    });
}

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

function catalogProcess() {

  // ------------------------------------------------------------------------------------
  const swiperCatalog = new Swiper('.catalog', {
    loop: false,
    spaceBetween: 32,
    slidesPerGroup: 3,
    slidesPerView: 3,
    autoHeight: false,
    grid: {
      rows: 3,
    },
    breakpoints: {
      320: {
        spaceBetween: 16,
        slidesPerView: 2,
        slidesPerGroup: 2,
        grid: {
          rows: 3,
        },
      },
      576: {
        spaceBetween: 32,
        slidesPerView: 2,
        slidesPerGroup: 2,
        grid: {
          rows: 3,
        },
      },
      1024: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: {
          rows: 3,
        },
      },
    },
    navigation: {
      nextEl: ".good__btn-next",
      prevEl: ".good__btn-prev",
      disabledClass: 'btn-icon--disabled',
    },
    pagination: {
      el: ".catalog__pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    },
  });

  // ------------------------------------------------------------------------------------
  // ценовой слайдер
  const sliderPrice = document.getElementById('filter-slider-price');
  if (sliderPrice) {
    noUiSlider.create(sliderPrice, {
      range: {
        'min': 0,
        '5%': 2000,
        '66%': 150000,
        'max': 200000
      },
      start: [2000, 150000], // стартовое и конечное значение ползунков
      connect: true, // окраска диапазона
      step: 1, // шаг переключения
      behaviour: 'tap-drag',
      tooptips: false, // отключить подсказки над ползунками
    });

    // элементы ползунков
    var valuesDivs = [
      document.getElementById('filter-block-input-price-from'),
      document.getElementById('filter-block-input-price-till'),
    ];

    // автоматически изменять значения в инпутах при смене на слайдере
    sliderPrice.noUiSlider.on('update', function (values, handle) {
      valuesDivs[handle].value = parseInt(values[handle]);
    });

    valuesDivs.forEach(input => {
      // автоматически менять значения на слайдере при смене знчений в инпутах
      let timerFrom, timerTill;
      input.addEventListener('input', (e) => {
        const slider = document.getElementById('filter-slider-price');
        const value = parseInt(input.value);

        if (input.id === 'filter-block-input-price-from') {
          clearTimeout(timerFrom);
          timerFrom = setTimeout(() => { slider.noUiSlider.set([value, null]) }, 300);
        } else {
          clearTimeout(timerTill);
          timerTill = setTimeout(() => { slider.noUiSlider.set([null, value]) }, 300);
        }
      });
    });
  }

  // ------------------------------------------------------------------------------------
  // ! !!! селект с чеками
  let filterCategories = [];
  initSelectCheck();
  initSelectInput();

  // ! обслуживание селектов с чеками
  document.addEventListener('click', (e) => {
    const target = e.target;

    // ? проверка для закрытия меню: ----------------------------------------------------------------------------------
    // ?  1. был ли щелчок по кнопке с бургером либо в пределах бургер-меню (проверяем родителей таргетов)
    // ?  2. если щелчок производился не по элементам с такими родителями, то закрыаем меню (в случае если оно открыто)
    console.log(target.dataset.block);
    console.log(target.closest('.header__burger'));
    console.log(target.closest('.header__burger-menu'));
    if (!target.closest('.header__burger') && !target.closest('.header__burger-menu')) burgerMenuClose(e);
    // ? --------------------------------------------------------------------------------------------------------------

    // перебрать все селекты на странице и закрыть их, если щелчок произвелся не на них
    document.querySelectorAll('.select-check').forEach(select => {
      // console.log(select);
      try {
        // если класс элемента, вызвавшего событие, не включает айдишник селекта, то закрыть его
        if (!target.className?.includes(select.id)) {
          select.classList.remove('is-active');
        }
      } catch (e) {
        console.log('Ошибка обработки селекта ' + target + ': ' + e.name, e.message + ': в качестве event получен объект SVGSVGElement (щелчок по иконке на кнопке селекта)');
      }
    });

    // перебрать все селекты на странице и закрыть их, если щелчок произвелся не на них
    document.querySelectorAll('.select-input').forEach(select => {
      // console.log(select);
      try {
        // если класс элемента, вызвавшего событие, не включает айдишник селекта, то закрыть его
        if (!target.className?.includes(select.id)) {
          select.classList.remove('is-active');
        }
      } catch (e) {
        console.log('Ошибка обработки селекта ' + target + ': ' + e.name, e.message + ': в качестве event получен объект SVGSVGElement (щелчок по иконке на кнопке селекта)');
      }
    });
  });
}



// ! инициализация селекта с инпутом
function initSelectInput() {
  const selectsHeader = document.querySelectorAll('.select-input__header');
  const selectsInput = document.querySelectorAll('.select-input__input');

  // открытие/закрытие списка
  if (selectsHeader) {
    selectsHeader.forEach(header => {
      header.addEventListener('click', selectToggle);
    });
  }

  // выбор/снятие вариантов
  if (selectsInput) {
    selectsInput.forEach(item => {
      item.addEventListener('change', selectChange);
    });
  }

  function selectToggle() {
    this.closest('.select-input').classList.toggle('is-active');
  }

  function selectChange() {
    const select = this.closest('.select-input');
    const current = select.querySelector('.select-input__current');
    const inputs = select.querySelectorAll('.select-input__input');

    let from, till;
    inputs.forEach(input => {
      switch (input.dataset.priceType) {
        case 'from':
          from = input.value;
        case 'till':
          till = input.value;
      }
    });

    // если ОТ и ДО пустые, то выводить placeholder
    // если только ОТ пустое, то выводить "< ДО"
    // если только ДО пустое, то выводить "> ОТ"
    // иначе выводить "от ОТ до ДО" или "ОТ ... ДО"

    let values;
    if (!from && !till) {
      values = undefined;
    } else if (from && till) {
      values = `${from} - ${till}`;
    } else if (!from) {
      values = `до ${till}`;
    } else if (!till) {
      values = `от ${from}`;
    }

    if (values) {
      current.innerText = values;
      select.dataset.value = JSON.stringify({ min: parseInt(from), max: parseInt(till) });
      current.classList.add('is-selected');
    } else {
      current.textContent = select.dataset.placeholder;
      select.dataset.value = '';
      current.classList.remove('is-selected');
    }
  }
}

// ! инициализация селекта с чеками
function initSelectCheck() {
  const selectsHeader = document.querySelectorAll('.select-check__header');

  // обработка всех селектов
  if (selectsHeader) {
    selectsHeader.forEach(header => {
      // ? открытие/закрытие списка
      header.addEventListener('click', selectToggle);

      // ? выбор/снятие вариантов
      const selectsInput = header.closest('.select-check').querySelectorAll('.select-check__item .checkbox input');
      if (selectsInput) {
        selectsInput.forEach(item => {
          item.addEventListener('change', selectChange);
        })
      }
    });
  }

  function selectToggle() {
    this.closest('.select-check').classList.toggle('is-active');
  }

  function selectChange() {
    const select = this.closest('.select-check');
    const current = select.querySelector('.select-check__current');
    const checkboxes = select.querySelectorAll('.checkbox');

    let values = []; // массив выбранных вариантов (name + caption)

    checkboxes.forEach(checkbox => {
      const itemLabel = checkbox.querySelector('label');
      const itemName = itemLabel.dataset.name;
      const itemCaption = itemLabel.textContent;
      const itemValue = checkbox.querySelector('input').checked;

      if (itemValue) {
        values.push({ name: itemName, caption: itemCaption });
      }
    });

    // изменение значений и заполнение select.data-value
    if (values.length) {
      current.innerText = values.map(item => item.caption).join(', ');
      select.dataset.value = values.map(item => item.name).join(',');
      current.classList.add('is-selected');
    } else {
      current.textContent = select.dataset.placeholder;
      select.dataset.value = '';
      current.classList.remove('is-selected');
    }
  }
}

function categoriesProcess() {
    // категории
    const categories = document.querySelectorAll('.categories__list');
    categories.forEach(category => {
      const choices = new Choices(category, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        allowHTML: true,
        // position: 'down',
        choices: [
          { value: 'empty', label: 'Категория', selected: true, disabled: true },
          { value: 'Диваны', label: 'Диваны' },
          { value: 'Кресла', label: 'Кресла' },
          { value: 'Пуфы', label: 'Пуфы' },
          { value: 'Кровати', label: 'Кровати' },
          { value: 'Тумбы', label: 'Тумбы' },
          { value: 'Комоды', label: 'Комоды' },
          { value: 'Стулья', label: 'Стулья' },
          { value: 'Столы', label: 'Столы' },
          { value: 'Аксессуары', label: 'Аксессуары' },
        ],
      });
    });
}

const recordsProcess = function() {
  dottedProcess('.record__delimiter')
};

const dottedProcess = function(stringTag) {
  const tag = stringTag || '.dotted p';
  const dottedStrings = document.querySelectorAll(tag);
  dottedStrings.forEach(str => {
    str.setAttribute('data-content', '.'.repeat(200));
  });
};


function goodProcess() {
  const swiperOffers = new Swiper('.good', {
    loop: false,
    spaceBetween: 32,
    slidesPerGroup: 1,
    slidesPerView: 2,
    autoHeight: false,
    breakpoints: {
      320: { // when window width is >= 320px
        slidesPerView: 1
      },
      576: { // when window width is >= 768px
        slidesPerView: 2
      },
      1024: { // when window width is >= 1024px
        slidesPerView: 3,
      },
      1352: {
        slidesPerView: 2
      }
    },
    navigation: {
      nextEl: ".good__btn-next",
      prevEl: ".good__btn-prev",
      disabledClass: 'btn-icon--disabled',
    },
  });
}

function modalsProcess() {
  // ? очистить модальный диалог от лишних доп. стилей
  function resetModalDialogStyles() {
    document.getElementById('modal-dialog').classList.remove('modal-dialog--photo');
  }
  // ? закрытие модалки со сворачиванием всех видов модальных окон внутри
  function closeModal() {
    document.getElementById('modal').classList.remove('scale-1'); // ? скрыть модалку (медленно)
    setTimeout(() => {
      ['modal-buy', 'modal-buy-confirm', 'modal-photo'].forEach(modalKindName => { // ? закрыть каждый вид модального окна внутри модалки
        const modalKind = document.getElementById(modalKindName);
        if (!modalKind.classList.contains('none')) {
          document.getElementById(modalKindName).classList.add('none');
        }
      });
      resetModalDialogStyles();
      document.body.classList.remove('stop-scroll'); // ? включить пролистывание страницы

    }, 300);
  }

  // ! открытие модалки по клику на любой элемент с классом js-modal-open
  document.querySelectorAll('.js-modal-open').forEach(item => {
    const modalKind = document.getElementById(item.dataset.target); // ? в target записывается id вида модального окна для открытия, т.к. видов несколько
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('stop-scroll'); // ? убрать пролистывание страницы
      modalKind.classList.remove('none'); // ? отобразить вид модального окна внутри модалки (они все невидимы по умолчанию)
      document.getElementById('modal').classList.add('scale-1'); // ? показать модалку (медленно)

      changeModalDialogStyles(item.dataset.target); // ? изменить дефолтные настройки модального окна в зависимости от диалога

      // ? если модальное окно с фотками, установить нужную фотографию
      const photoIndex = item.dataset.modalPhotoIndex;
      modalPhotoMainSlider.activeIndex = photoIndex; // ! --------> почему не работает?!
    })
  });

  // изменить дефолтные настройки модального диалога, если требуется
  function changeModalDialogStyles(modalKindName) {
    const modalDialog = document.getElementById('modal-dialog');

    if (modalKindName === 'modal-photo') {
      modalDialog.classList.add('modal-dialog--photo');
    }
  }

  // ! закрытие модалки
  // 1. при клике вне диалога
  document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e._isClickWithinModalDialog) return;
    closeModal();
  })

  // 2. при клике на крестик
  document.getElementById('modal-close')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
  });

  // ! установка проверки на клик внутри диалога
  document.getElementById('modal-dialog')?.addEventListener('click', (e) => {
    e._isClickWithinModalDialog = true;
  })

  // ------------------------------------------------------------------------------
  // ! работа с модальной формой
  if (document.getElementById('modal-dialog-buy-form')) {
    // ! валидация
    const inputModalFormPhone = document.getElementById('modal-dialog-buy-phone');
    const validationModalBuy = new JustValidate('#modal-dialog-buy-form', {
      focusInvalidField: true,
      validateBeforeSubmitting: true,
      // errorsContainer: document.getElementById('client-error'),
      errorFieldCssClass: 'invalidated',
    })
      .addField('#modal-dialog-buy-fio', [
        {
          rule: 'required',
          errorMessage: 'Введите ФИО',
        }
      ])
      .addField('#modal-dialog-buy-phone', [
        {
          rule: 'required',
          errorMessage: `Введите номер`,
        },
        {
          validator: function (value, context) {
            const numValue = inputModalFormPhone.inputmask.unmaskedvalue();
            return Boolean(Number(numValue) && numValue.length === 10);
          },
          errorMessage: 'Некорректный номер',
        },
      ]);
    // .addField('#request-email', [
    //   {
    //     rule: 'required',
    //     errorMessage: 'Введите e-mail',
    //   },
    //   {
    //     rule: 'email',
    //     errorMessage: 'Неправильный формат',
    //   }
    // ]);

    validationModalBuy.revalidate(); // нужна ревалидация, чтобы при открытии формы и сразу же нажатии "Отправить" не происходила отправка пустых данных

    // ! submit модальной формы
    const form = document.getElementById('modal-dialog-buy-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.querySelector('.invalidated')) {
        document.getElementById('modal-buy').classList.add('none');
        document.getElementById('modal-buy-confirm').classList.remove('none');
      }
    })
  }

  // ------------------------------------------------------------------------------
  // ! работа с модальными слайдерами
  // список маленьких фото
  const modalPhotoListSlider = new Swiper(".modal-dialog__photo-list-swiper", {
    spaceBetween: 78,
    slidesPerView: 4,
    // freeMode: true, // -----> свободное перелистывание без скачков
    watchSlidesProgress: true,
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 39,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 78,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 78,
      },
      1352: {
        slidesPerView: 4,
        spaceBetween: 78,
      }
    },
  });
  // главное большое фото
  const modalPhotoMainSlider = new Swiper(".modal-dialog__photo-main-swiper", {
    spaceBetween: 10,
    navigation: {
      nextEl: ".modal-dialog__photo-button-next",
      prevEl: ".modal-dialog__photo-button-prev",
      disabledClass: 'btn-icon--disabled',
    },
    thumbs: {
      swiper: modalPhotoListSlider,
    },
  });
}

function offersProcess() {
  const swiperOffers = new Swiper('.offers', {
    loop: false,
    spaceBetween: 32,
    slidesPerGroup: 3,
    slidesPerView: 3,
    autoHeight: false,
    breakpoints: {
      320: { // when window width is >= 320px
        slidesPerView: 1,
        slidesPerGroup: 1
      },
      768: { // when window width is >= 768px
        slidesPerView: 2,
        slidesPerGroup: 1
      },
      1024: { // when window width is >= 1024px
        slidesPerView: 3,
        slidesPerGroup: 1
      },
      1352: {
        slidesPerGroup: 3
      }
    },
    navigation: {
      nextEl: ".offers__btn-next",
      prevEl: ".offers__btn-prev",
      disabledClass: 'btn-icon--disabled',
    },
  });
}

function productProcess() {

  // ! мини-фотки перелистываются без скролла, на тачскринах, либо при нажатии средней кнопки мыши
  // // основные фотографии
  // const photos = new Swiper(".product-photos-swiper", {
  //   spaceBetween: 1,
  //   slidesPerView: 1,
  //   freeMode: false,
  //   watchSlidesProgress: true,
  //   direction: 'horizontal',
  // });

  // // мини-копии фотографий
  // const photosList = new Swiper(".product-photos-list-swiper", {
  //   spaceBetween: 38,
  //   slidesPerView: 'auto-fil',
  //   freeMode: true,
  //   watchSlidesProgress: true,
  //   direction: 'horizontal',
  //   breakpoints: {
  //     320: {
  //       direction: 'horizontal',
  //     },
  //     576: {
  //       direction: 'vertical',
  //     },
  //     1024: {
  //       direction: 'horizontal',
  //     },
  //   }
  // });

  // замена изображения по щелчку мыши на списки мини-картинок
  const listImgs = document.querySelectorAll('.list-img');
  if (listImgs && listImgs.length) {
    listImgs.forEach(item => {
      item.addEventListener('click', (e) => {
        const bigImgURL = item.dataset.bimage;
        const bigImg = document.getElementById('big-img');
        bigImg.setAttribute('src', bigImgURL);

        // ? сохранить индекс изображения, который будет отображен в модальном окне при щелчке на большое фото
        const imgParent = bigImg.closest('.product-photo-main');
        imgParent.dataset.modalPhotoIndex = 4; // ! -----> сохраняю номер, но в modal.js изменение activeSlide в стр.33 не работает!
      })
    });
  }

  // ! открытие модального окна со слайдерами изображений ====> см. modal.js
  // const prodPhotos = document.getElementById('product-photos');
  // if (prodPhotos) {
  //   prodPhotos.addEventListener('click', (e) => {
  //     alert('здрав буде, боярин!');
  //   });
  // }

  // ! слайдер с похожими товарами
  const swiperSame = new Swiper('.same', {
    loop: false,
    spaceBetween: 32,
    slidesPerGroup: 1,
    slidesPerView: 4,
    autoHeight: false,
    breakpoints: {
      320: { // when window width is >= 320px
        slidesPerView: 2,
        spaceBetween: 16,
      },
      576: { // when window width is >= 768px
        slidesPerView: 2,
        spaceBetween: 32
      },
      1024: { // when window width is >= 1024px
        slidesPerView: 3,
      },
      1352: {
        slidesPerView: 4
      }
    },
    navigation: {
      nextEl: ".same__btn-next",
      prevEl: ".same__btn-prev",
      disabledClass: 'btn-icon--disabled',
    },
  });

}

function requestsProcess() {
  // хинт
  tippy('.request__hint', {
    content: 'Реплицированные с зарубежных источников, исследования формируют глобальную сеть.',
    allowHTML: true,
    interactive: true,
    theme: 'main',
    maxWidth: 157
  });

  const inputFio = document.querySelector('.input-fio');
  const inputsPhone = document.querySelectorAll('.input-phone');
  const inputEmail = document.querySelector('.input-email');

  for (let inputPhone of inputsPhone) {
    // маски ввода
    Inputmask({ mask: '+7 (999) 999-99-99' }).mask(inputPhone);

    // валидация
    if (document.getElementById('request-form')) {
      const validation = new JustValidate('#request-form', {
        focusInvalidField: true,
        validateBeforeSubmitting: true,
        // errorsContainer: document.getElementById('client-error'),
        errorFieldCssClass: 'invalidated',
      })
        .addField('#request-fio', [
          {
            rule: 'required',
            errorMessage: 'Введите ФИО',
          }
        ])
        .addField('#request-phone', [
          {
            rule: 'required',
            errorMessage: `Введите номер`,
          },
          {
            validator: function (value, context) {
              const numValue = inputPhone.inputmask.unmaskedvalue();
              return Boolean(Number(numValue) && numValue.length === 10);
            },
            errorMessage: 'Некорректный номер',
          },
        ])
        .addField('#request-email', [
          {
            rule: 'required',
            errorMessage: 'Введите e-mail',
          },
          {
            rule: 'email',
            errorMessage: 'Неправильный формат',
          }
        ]);

      // validation.revalidate();
    }
  }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJiYW5uZXJFbGVtZW50cy5qcyIsImJyYW5jaGVzRWxlbWVudHMuanMiLCJidXJnZXJNZW51LmpzIiwiY2F0YWxvZ0VsZW1lbnRzLmpzIiwiY2F0ZWdvcmllc0VsZW1lbnRzLmpzIiwiZG90dGVkRWxlbWVudHMuanMiLCJnb29kRWxlbWVudHMuanMiLCJtb2RhbC5qcyIsIm9mZmVyc0VsZW1lbnRzLmpzIiwicHJvZHVjdEVsZW1lbnRzLmpzIiwicmVxdWVzdHNFbGVtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKCgpID0+IHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChlKSA9PiB7XG5cbiAgICByZWNvcmRzUHJvY2VzcygpO1xuICAgIGRvdHRlZFByb2Nlc3MoKTtcblxuICAgIGRvdHRlZFByb2Nlc3MoJy5kb3R0ZWQtc3RyIHAnKTtcblxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINCx0YPRgNCz0LXRgC3QvNC10L3RjlxuICAgIGJ1cmdlck1lbnVQcm9jZXNzKCk7XG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQtdC70LXQutGC0L7QsiDRgSDRgNC10LPQuNC+0L3QsNC80LhcbiAgICBicmFuY2hlc1Byb2Nlc3MoKTtcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC10LvQtdC60YLQvtCyINGBINC60LDRgtC10LPQvtGA0LjRj9C80LhcbiAgICBjYXRlZ29yaWVzUHJvY2VzcygpO1xuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0LLQsNC50L/QtdGA0LAg0YEg0LHQsNC90L3QtdGA0LDQvNC4XG4gICAgYmFubmVyUHJvY2VzcygpO1xuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0LLQsNC50L/QtdGA0LAg0YHQviDRgdC/0LXRhtC/0YDQtdC00LvQvtC20LXQvdC40Y/QvNC4XG4gICAgb2ZmZXJzUHJvY2VzcygpO1xuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0LLQsNC50L/QtdGA0LAg0YEg0L/QvtC70LXQt9C90YvQvFxuICAgIGdvb2RQcm9jZXNzKCk7XG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LHQu9C+0LrQsCDRgSDQt9Cw0Y/QstC60LDQvNC4XG4gICAgcmVxdWVzdHNQcm9jZXNzKCk7XG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LrQsNGC0LDQu9C+0LPQsFxuICAgIGNhdGFsb2dQcm9jZXNzKCk7XG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHRgtGA0LDQvdC40YbRiyDRgSDQv9GA0L7QtNGD0LrRgtC+0LxcbiAgICBwcm9kdWN0UHJvY2VzcygpO1xuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC80L7QtNCw0LvRjNC90YvRhSDQvtC60L7QvVxuICAgIG1vZGFsc1Byb2Nlc3MoKTtcblxuICB9KTtcbn0pKClcbiIsImZ1bmN0aW9uIGJhbm5lclByb2Nlc3MoKSB7XG4gIGNvbnN0IGJhbm5lciA9IG5ldyBTd2lwZXIoJy5iYW5uZXInLCB7XG4gICAgbG9vcDogdHJ1ZSxcbiAgICBzcGFjZUJldHdlZW46IDAsXG4gICAgc2xpZGVzUGVyVmlldzogMSxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICBlbDogJy5iYW5uZXJfX3BhZ2luYXRpb24nLFxuICAgICAgdHlwZTogJ2J1bGxldHMnLFxuICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgYnVsbGV0Q2xhc3M6ICdiYW5uZXJfX3BhZ2luYXRpb24tYnVsbGV0JyxcbiAgICAgIGJ1bGxldEFjdGl2ZUNsYXNzOiAnYmFubmVyX19wYWdpbmF0aW9uLWJ1bGxldC0tYWN0aXZlJ1xuICAgIH0sXG4gIH0pO1xufVxuIiwiZnVuY3Rpb24gYnJhbmNoZXNQcm9jZXNzKCkge1xuICAgIC8vINGA0LXQs9C40L7QvdGLXG4gICAgY29uc3QgYnJhbmNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnJhbmNoZXNfX2xpc3QnKTtcbiAgICBicmFuY2hlcy5mb3JFYWNoKGJyYW5jaCA9PiB7XG4gICAgICBjb25zdCBjaG9pY2VzID0gbmV3IENob2ljZXMoYnJhbmNoLCB7XG4gICAgICAgIHNlYXJjaEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBzaG91bGRTb3J0OiBmYWxzZSxcbiAgICAgICAgaXRlbVNlbGVjdFRleHQ6ICcnLFxuICAgICAgICBhbGxvd0hUTUw6IHRydWUsXG4gICAgICAgIC8vIHBvc2l0aW9uOiAnZG93bicsXG4gICAgICAgIGNob2ljZXM6IFtcbiAgICAgICAgICB7IHZhbHVlOiAn0JzQvtGB0LrQstCwJywgbGFiZWw6ICfQnNC+0YHQutCy0LAnLCBzZWxlY3RlZDogdHJ1ZSwgZGlzYWJsZWQ6IGZhbHNlIH0sXG4gICAgICAgICAgeyB2YWx1ZTogJ9Ca0LDQt9Cw0L3RjCcsIGxhYmVsOiAn0JrQsNC30LDQvdGMJyB9LFxuICAgICAgICAgIHsgdmFsdWU6ICfQo9GE0LAnLCBsYWJlbDogJ9Cj0YTQsCcgfSxcbiAgICAgICAgICB7IHZhbHVlOiAn0J/QtdGA0LzRjCcsIGxhYmVsOiAn0J/QtdGA0LzRjCcgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiZnVuY3Rpb24gYnVyZ2VyTWVudVByb2Nlc3MoKSB7XG4gIGNvbnN0IGJ1cmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXJnZXInKTtcbiAgY29uc3QgYnVyZ2VyQ2xvc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVyZ2VyLWNsb3NlJyk7XG5cbiAgYnVyZ2VyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBidXJnZXJNZW51Q2xvc2UoZSk7XG4gIH0pXG5cbiAgYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBidXJnZXJNZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1cmdlci1tZW51Jyk7XG4gICAgYnVyZ2VyTWVudS5jbGFzc0xpc3QuYWRkKCdhYnNvbHV0ZS12aXNpYmxlJyk7XG4gICAgYnVyZ2VyTWVudS5jbGFzc0xpc3QucmVtb3ZlKCd0cmFuc3BhcmVudCcpO1xuXG4gICAgZS5fYnVyZ2VyTWVudU9wZW5lZCA9IHRydWU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBidXJnZXJNZW51Q2xvc2UoZSkge1xuICBlLl9idXJnZXJNZW51T3BlbmVkID0gZmFsc2U7XG5cbiAgY29uc3QgYnVyZ2VyTWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXJnZXItbWVudScpO1xuICBidXJnZXJNZW51LmNsYXNzTGlzdC5hZGQoJ3RyYW5zcGFyZW50Jyk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGJ1cmdlck1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnYWJzb2x1dGUtdmlzaWJsZScpO1xuICB9LCAyMDApO1xufVxuIiwiZnVuY3Rpb24gY2F0YWxvZ1Byb2Nlc3MoKSB7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0IHN3aXBlckNhdGFsb2cgPSBuZXcgU3dpcGVyKCcuY2F0YWxvZycsIHtcbiAgICBsb29wOiBmYWxzZSxcbiAgICBzcGFjZUJldHdlZW46IDMyLFxuICAgIHNsaWRlc1Blckdyb3VwOiAzLFxuICAgIHNsaWRlc1BlclZpZXc6IDMsXG4gICAgYXV0b0hlaWdodDogZmFsc2UsXG4gICAgZ3JpZDoge1xuICAgICAgcm93czogMyxcbiAgICB9LFxuICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICAzMjA6IHtcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiAxNixcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMixcbiAgICAgICAgc2xpZGVzUGVyR3JvdXA6IDIsXG4gICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICByb3dzOiAzLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIDU3Njoge1xuICAgICAgICBzcGFjZUJldHdlZW46IDMyLFxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAyLFxuICAgICAgICBzbGlkZXNQZXJHcm91cDogMixcbiAgICAgICAgZ3JpZDoge1xuICAgICAgICAgIHJvd3M6IDMsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgMTAyNDoge1xuICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxuICAgICAgICBzbGlkZXNQZXJHcm91cDogMyxcbiAgICAgICAgZ3JpZDoge1xuICAgICAgICAgIHJvd3M6IDMsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgbmF2aWdhdGlvbjoge1xuICAgICAgbmV4dEVsOiBcIi5nb29kX19idG4tbmV4dFwiLFxuICAgICAgcHJldkVsOiBcIi5nb29kX19idG4tcHJldlwiLFxuICAgICAgZGlzYWJsZWRDbGFzczogJ2J0bi1pY29uLS1kaXNhYmxlZCcsXG4gICAgfSxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICBlbDogXCIuY2F0YWxvZ19fcGFnaW5hdGlvblwiLFxuICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgcmVuZGVyQnVsbGV0OiBmdW5jdGlvbiAoaW5kZXgsIGNsYXNzTmFtZSkge1xuICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwiJyArIGNsYXNzTmFtZSArICdcIj4nICsgKGluZGV4ICsgMSkgKyBcIjwvc3Bhbj5cIjtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vINGG0LXQvdC+0LLQvtC5INGB0LvQsNC50LTQtdGAXG4gIGNvbnN0IHNsaWRlclByaWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbHRlci1zbGlkZXItcHJpY2UnKTtcbiAgaWYgKHNsaWRlclByaWNlKSB7XG4gICAgbm9VaVNsaWRlci5jcmVhdGUoc2xpZGVyUHJpY2UsIHtcbiAgICAgIHJhbmdlOiB7XG4gICAgICAgICdtaW4nOiAwLFxuICAgICAgICAnNSUnOiAyMDAwLFxuICAgICAgICAnNjYlJzogMTUwMDAwLFxuICAgICAgICAnbWF4JzogMjAwMDAwXG4gICAgICB9LFxuICAgICAgc3RhcnQ6IFsyMDAwLCAxNTAwMDBdLCAvLyDRgdGC0LDRgNGC0L7QstC+0LUg0Lgg0LrQvtC90LXRh9C90L7QtSDQt9C90LDRh9C10L3QuNC1INC/0L7Qu9C30YPQvdC60L7QslxuICAgICAgY29ubmVjdDogdHJ1ZSwgLy8g0L7QutGA0LDRgdC60LAg0LTQuNCw0L/QsNC30L7QvdCwXG4gICAgICBzdGVwOiAxLCAvLyDRiNCw0LMg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPXG4gICAgICBiZWhhdmlvdXI6ICd0YXAtZHJhZycsXG4gICAgICB0b29wdGlwczogZmFsc2UsIC8vINC+0YLQutC70Y7Rh9C40YLRjCDQv9C+0LTRgdC60LDQt9C60Lgg0L3QsNC0INC/0L7Qu9C30YPQvdC60LDQvNC4XG4gICAgfSk7XG5cbiAgICAvLyDRjdC70LXQvNC10L3RgtGLINC/0L7Qu9C30YPQvdC60L7QslxuICAgIHZhciB2YWx1ZXNEaXZzID0gW1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbHRlci1ibG9jay1pbnB1dC1wcmljZS1mcm9tJyksXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsdGVyLWJsb2NrLWlucHV0LXByaWNlLXRpbGwnKSxcbiAgICBdO1xuXG4gICAgLy8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0LjQt9C80LXQvdGP0YLRjCDQt9C90LDRh9C10L3QuNGPINCyINC40L3Qv9GD0YLQsNGFINC/0YDQuCDRgdC80LXQvdC1INC90LAg0YHQu9Cw0LnQtNC10YDQtVxuICAgIHNsaWRlclByaWNlLm5vVWlTbGlkZXIub24oJ3VwZGF0ZScsIGZ1bmN0aW9uICh2YWx1ZXMsIGhhbmRsZSkge1xuICAgICAgdmFsdWVzRGl2c1toYW5kbGVdLnZhbHVlID0gcGFyc2VJbnQodmFsdWVzW2hhbmRsZV0pO1xuICAgIH0pO1xuXG4gICAgdmFsdWVzRGl2cy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgIC8vINCw0LLRgtC+0LzQsNGC0LjRh9C10YHQutC4INC80LXQvdGP0YLRjCDQt9C90LDRh9C10L3QuNGPINC90LAg0YHQu9Cw0LnQtNC10YDQtSDQv9GA0Lgg0YHQvNC10L3QtSDQt9C90YfQtdC90LjQuSDQsiDQuNC90L/Rg9GC0LDRhVxuICAgICAgbGV0IHRpbWVyRnJvbSwgdGltZXJUaWxsO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgICAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsdGVyLXNsaWRlci1wcmljZScpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHBhcnNlSW50KGlucHV0LnZhbHVlKTtcblxuICAgICAgICBpZiAoaW5wdXQuaWQgPT09ICdmaWx0ZXItYmxvY2staW5wdXQtcHJpY2UtZnJvbScpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXJGcm9tKTtcbiAgICAgICAgICB0aW1lckZyb20gPSBzZXRUaW1lb3V0KCgpID0+IHsgc2xpZGVyLm5vVWlTbGlkZXIuc2V0KFt2YWx1ZSwgbnVsbF0pIH0sIDMwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyVGlsbCk7XG4gICAgICAgICAgdGltZXJUaWxsID0gc2V0VGltZW91dCgoKSA9PiB7IHNsaWRlci5ub1VpU2xpZGVyLnNldChbbnVsbCwgdmFsdWVdKSB9LCAzMDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyAhICEhISDRgdC10LvQtdC60YIg0YEg0YfQtdC60LDQvNC4XG4gIGxldCBmaWx0ZXJDYXRlZ29yaWVzID0gW107XG4gIGluaXRTZWxlY3RDaGVjaygpO1xuICBpbml0U2VsZWN0SW5wdXQoKTtcblxuICAvLyAhINC+0LHRgdC70YPQttC40LLQsNC90LjQtSDRgdC10LvQtdC60YLQvtCyINGBINGH0LXQutCw0LzQuFxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICAvLyA/INC/0YDQvtCy0LXRgNC60LAg0LTQu9GPINC30LDQutGA0YvRgtC40Y8g0LzQtdC90Y46IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyA/ICAxLiDQsdGL0Lsg0LvQuCDRidC10LvRh9C+0Log0L/QviDQutC90L7Qv9C60LUg0YEg0LHRg9GA0LPQtdGA0L7QvCDQu9C40LHQviDQsiDQv9GA0LXQtNC10LvQsNGFINCx0YPRgNCz0LXRgC3QvNC10L3RjiAo0L/RgNC+0LLQtdGA0Y/QtdC8INGA0L7QtNC40YLQtdC70LXQuSDRgtCw0YDQs9C10YLQvtCyKVxuICAgIC8vID8gIDIuINC10YHQu9C4INGJ0LXQu9GH0L7QuiDQv9GA0L7QuNC30LLQvtC00LjQu9GB0Y8g0L3QtSDQv9C+INGN0LvQtdC80LXQvdGC0LDQvCDRgSDRgtCw0LrQuNC80Lgg0YDQvtC00LjRgtC10LvRj9C80LgsINGC0L4g0LfQsNC60YDRi9Cw0LXQvCDQvNC10L3RjiAo0LIg0YHQu9GD0YfQsNC1INC10YHQu9C4INC+0L3QviDQvtGC0LrRgNGL0YLQvilcbiAgICBjb25zb2xlLmxvZyh0YXJnZXQuZGF0YXNldC5ibG9jayk7XG4gICAgY29uc29sZS5sb2codGFyZ2V0LmNsb3Nlc3QoJy5oZWFkZXJfX2J1cmdlcicpKTtcbiAgICBjb25zb2xlLmxvZyh0YXJnZXQuY2xvc2VzdCgnLmhlYWRlcl9fYnVyZ2VyLW1lbnUnKSk7XG4gICAgaWYgKCF0YXJnZXQuY2xvc2VzdCgnLmhlYWRlcl9fYnVyZ2VyJykgJiYgIXRhcmdldC5jbG9zZXN0KCcuaGVhZGVyX19idXJnZXItbWVudScpKSBidXJnZXJNZW51Q2xvc2UoZSk7XG4gICAgLy8gPyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLy8g0L/QtdGA0LXQsdGA0LDRgtGMINCy0YHQtSDRgdC10LvQtdC60YLRiyDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0Lgg0LfQsNC60YDRi9GC0Ywg0LjRhSwg0LXRgdC70Lgg0YnQtdC70YfQvtC6INC/0YDQvtC40LfQstC10LvRgdGPINC90LUg0L3QsCDQvdC40YVcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VsZWN0LWNoZWNrJykuZm9yRWFjaChzZWxlY3QgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coc2VsZWN0KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vINC10YHQu9C4INC60LvQsNGB0YEg0Y3Qu9C10LzQtdC90YLQsCwg0LLRi9C30LLQsNCy0YjQtdCz0L4g0YHQvtCx0YvRgtC40LUsINC90LUg0LLQutC70Y7Rh9Cw0LXRgiDQsNC50LTQuNGI0L3QuNC6INGB0LXQu9C10LrRgtCwLCDRgtC+INC30LDQutGA0YvRgtGMINC10LPQvlxuICAgICAgICBpZiAoIXRhcmdldC5jbGFzc05hbWU/LmluY2x1ZGVzKHNlbGVjdC5pZCkpIHtcbiAgICAgICAgICBzZWxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ9Ce0YjQuNCx0LrQsCDQvtCx0YDQsNCx0L7RgtC60Lgg0YHQtdC70LXQutGC0LAgJyArIHRhcmdldCArICc6ICcgKyBlLm5hbWUsIGUubWVzc2FnZSArICc6INCyINC60LDRh9C10YHRgtCy0LUgZXZlbnQg0L/QvtC70YPRh9C10L0g0L7QsdGK0LXQutGCIFNWR1NWR0VsZW1lbnQgKNGJ0LXQu9GH0L7QuiDQv9C+INC40LrQvtC90LrQtSDQvdCwINC60L3QvtC/0LrQtSDRgdC10LvQtdC60YLQsCknKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINC/0LXRgNC10LHRgNCw0YLRjCDQstGB0LUg0YHQtdC70LXQutGC0Ysg0L3QsCDRgdGC0YDQsNC90LjRhtC1INC4INC30LDQutGA0YvRgtGMINC40YUsINC10YHQu9C4INGJ0LXQu9GH0L7QuiDQv9GA0L7QuNC30LLQtdC70YHRjyDQvdC1INC90LAg0L3QuNGFXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlbGVjdC1pbnB1dCcpLmZvckVhY2goc2VsZWN0ID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNlbGVjdCk7XG4gICAgICB0cnkge1xuICAgICAgICAvLyDQtdGB0LvQuCDQutC70LDRgdGBINGN0LvQtdC80LXQvdGC0LAsINCy0YvQt9Cy0LDQstGI0LXQs9C+INGB0L7QsdGL0YLQuNC1LCDQvdC1INCy0LrQu9GO0YfQsNC10YIg0LDQudC00LjRiNC90LjQuiDRgdC10LvQtdC60YLQsCwg0YLQviDQt9Cw0LrRgNGL0YLRjCDQtdCz0L5cbiAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NOYW1lPy5pbmNsdWRlcyhzZWxlY3QuaWQpKSB7XG4gICAgICAgICAgc2VsZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfQntGI0LjQsdC60LAg0L7QsdGA0LDQsdC+0YLQutC4INGB0LXQu9C10LrRgtCwICcgKyB0YXJnZXQgKyAnOiAnICsgZS5uYW1lLCBlLm1lc3NhZ2UgKyAnOiDQsiDQutCw0YfQtdGB0YLQstC1IGV2ZW50INC/0L7Qu9GD0YfQtdC9INC+0LHRitC10LrRgiBTVkdTVkdFbGVtZW50ICjRidC10LvRh9C+0Log0L/QviDQuNC60L7QvdC60LUg0L3QsCDQutC90L7Qv9C60LUg0YHQtdC70LXQutGC0LApJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5cblxuLy8gISDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC10LvQtdC60YLQsCDRgSDQuNC90L/Rg9GC0L7QvFxuZnVuY3Rpb24gaW5pdFNlbGVjdElucHV0KCkge1xuICBjb25zdCBzZWxlY3RzSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlbGVjdC1pbnB1dF9faGVhZGVyJyk7XG4gIGNvbnN0IHNlbGVjdHNJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWxlY3QtaW5wdXRfX2lucHV0Jyk7XG5cbiAgLy8g0L7RgtC60YDRi9GC0LjQtS/Qt9Cw0LrRgNGL0YLQuNC1INGB0L/QuNGB0LrQsFxuICBpZiAoc2VsZWN0c0hlYWRlcikge1xuICAgIHNlbGVjdHNIZWFkZXIuZm9yRWFjaChoZWFkZXIgPT4ge1xuICAgICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZWN0VG9nZ2xlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vINCy0YvQsdC+0YAv0YHQvdGP0YLQuNC1INCy0LDRgNC40LDQvdGC0L7QslxuICBpZiAoc2VsZWN0c0lucHV0KSB7XG4gICAgc2VsZWN0c0lucHV0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNlbGVjdENoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZWxlY3RUb2dnbGUoKSB7XG4gICAgdGhpcy5jbG9zZXN0KCcuc2VsZWN0LWlucHV0JykuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZWxlY3RDaGFuZ2UoKSB7XG4gICAgY29uc3Qgc2VsZWN0ID0gdGhpcy5jbG9zZXN0KCcuc2VsZWN0LWlucHV0Jyk7XG4gICAgY29uc3QgY3VycmVudCA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWlucHV0X19jdXJyZW50Jyk7XG4gICAgY29uc3QgaW5wdXRzID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWxlY3QtaW5wdXRfX2lucHV0Jyk7XG5cbiAgICBsZXQgZnJvbSwgdGlsbDtcbiAgICBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICBzd2l0Y2ggKGlucHV0LmRhdGFzZXQucHJpY2VUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2Zyb20nOlxuICAgICAgICAgIGZyb20gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgY2FzZSAndGlsbCc6XG4gICAgICAgICAgdGlsbCA9IGlucHV0LnZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0LXRgdC70Lgg0J7QoiDQuCDQlNCeINC/0YPRgdGC0YvQtSwg0YLQviDQstGL0LLQvtC00LjRgtGMIHBsYWNlaG9sZGVyXG4gICAgLy8g0LXRgdC70Lgg0YLQvtC70YzQutC+INCe0KIg0L/Rg9GB0YLQvtC1LCDRgtC+INCy0YvQstC+0LTQuNGC0YwgXCI8INCU0J5cIlxuICAgIC8vINC10YHQu9C4INGC0L7Qu9GM0LrQviDQlNCeINC/0YPRgdGC0L7QtSwg0YLQviDQstGL0LLQvtC00LjRgtGMIFwiPiDQntCiXCJcbiAgICAvLyDQuNC90LDRh9C1INCy0YvQstC+0LTQuNGC0YwgXCLQvtGCINCe0KIg0LTQviDQlNCeXCIg0LjQu9C4IFwi0J7QoiAuLi4g0JTQnlwiXG5cbiAgICBsZXQgdmFsdWVzO1xuICAgIGlmICghZnJvbSAmJiAhdGlsbCkge1xuICAgICAgdmFsdWVzID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAoZnJvbSAmJiB0aWxsKSB7XG4gICAgICB2YWx1ZXMgPSBgJHtmcm9tfSAtICR7dGlsbH1gO1xuICAgIH0gZWxzZSBpZiAoIWZyb20pIHtcbiAgICAgIHZhbHVlcyA9IGDQtNC+ICR7dGlsbH1gO1xuICAgIH0gZWxzZSBpZiAoIXRpbGwpIHtcbiAgICAgIHZhbHVlcyA9IGDQvtGCICR7ZnJvbX1gO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgIGN1cnJlbnQuaW5uZXJUZXh0ID0gdmFsdWVzO1xuICAgICAgc2VsZWN0LmRhdGFzZXQudmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7IG1pbjogcGFyc2VJbnQoZnJvbSksIG1heDogcGFyc2VJbnQodGlsbCkgfSk7XG4gICAgICBjdXJyZW50LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnQudGV4dENvbnRlbnQgPSBzZWxlY3QuZGF0YXNldC5wbGFjZWhvbGRlcjtcbiAgICAgIHNlbGVjdC5kYXRhc2V0LnZhbHVlID0gJyc7XG4gICAgICBjdXJyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJyk7XG4gICAgfVxuICB9XG59XG5cbi8vICEg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQtdC70LXQutGC0LAg0YEg0YfQtdC60LDQvNC4XG5mdW5jdGlvbiBpbml0U2VsZWN0Q2hlY2soKSB7XG4gIGNvbnN0IHNlbGVjdHNIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VsZWN0LWNoZWNrX19oZWFkZXInKTtcblxuICAvLyDQvtCx0YDQsNCx0L7RgtC60LAg0LLRgdC10YUg0YHQtdC70LXQutGC0L7QslxuICBpZiAoc2VsZWN0c0hlYWRlcikge1xuICAgIHNlbGVjdHNIZWFkZXIuZm9yRWFjaChoZWFkZXIgPT4ge1xuICAgICAgLy8gPyDQvtGC0LrRgNGL0YLQuNC1L9C30LDQutGA0YvRgtC40LUg0YHQv9C40YHQutCwXG4gICAgICBoZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZWxlY3RUb2dnbGUpO1xuXG4gICAgICAvLyA/INCy0YvQsdC+0YAv0YHQvdGP0YLQuNC1INCy0LDRgNC40LDQvdGC0L7QslxuICAgICAgY29uc3Qgc2VsZWN0c0lucHV0ID0gaGVhZGVyLmNsb3Nlc3QoJy5zZWxlY3QtY2hlY2snKS5xdWVyeVNlbGVjdG9yQWxsKCcuc2VsZWN0LWNoZWNrX19pdGVtIC5jaGVja2JveCBpbnB1dCcpO1xuICAgICAgaWYgKHNlbGVjdHNJbnB1dCkge1xuICAgICAgICBzZWxlY3RzSW5wdXQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNlbGVjdENoYW5nZSk7XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZWxlY3RUb2dnbGUoKSB7XG4gICAgdGhpcy5jbG9zZXN0KCcuc2VsZWN0LWNoZWNrJykuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZWxlY3RDaGFuZ2UoKSB7XG4gICAgY29uc3Qgc2VsZWN0ID0gdGhpcy5jbG9zZXN0KCcuc2VsZWN0LWNoZWNrJyk7XG4gICAgY29uc3QgY3VycmVudCA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWNoZWNrX19jdXJyZW50Jyk7XG4gICAgY29uc3QgY2hlY2tib3hlcyA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCcuY2hlY2tib3gnKTtcblxuICAgIGxldCB2YWx1ZXMgPSBbXTsgLy8g0LzQsNGB0YHQuNCyINCy0YvQsdGA0LDQvdC90YvRhSDQstCw0YDQuNCw0L3RgtC+0LIgKG5hbWUgKyBjYXB0aW9uKVxuXG4gICAgY2hlY2tib3hlcy5mb3JFYWNoKGNoZWNrYm94ID0+IHtcbiAgICAgIGNvbnN0IGl0ZW1MYWJlbCA9IGNoZWNrYm94LnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBpdGVtTmFtZSA9IGl0ZW1MYWJlbC5kYXRhc2V0Lm5hbWU7XG4gICAgICBjb25zdCBpdGVtQ2FwdGlvbiA9IGl0ZW1MYWJlbC50ZXh0Q29udGVudDtcbiAgICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IGNoZWNrYm94LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykuY2hlY2tlZDtcblxuICAgICAgaWYgKGl0ZW1WYWx1ZSkge1xuICAgICAgICB2YWx1ZXMucHVzaCh7IG5hbWU6IGl0ZW1OYW1lLCBjYXB0aW9uOiBpdGVtQ2FwdGlvbiB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINC40LfQvNC10L3QtdC90LjQtSDQt9C90LDRh9C10L3QuNC5INC4INC30LDQv9C+0LvQvdC10L3QuNC1IHNlbGVjdC5kYXRhLXZhbHVlXG4gICAgaWYgKHZhbHVlcy5sZW5ndGgpIHtcbiAgICAgIGN1cnJlbnQuaW5uZXJUZXh0ID0gdmFsdWVzLm1hcChpdGVtID0+IGl0ZW0uY2FwdGlvbikuam9pbignLCAnKTtcbiAgICAgIHNlbGVjdC5kYXRhc2V0LnZhbHVlID0gdmFsdWVzLm1hcChpdGVtID0+IGl0ZW0ubmFtZSkuam9pbignLCcpO1xuICAgICAgY3VycmVudC5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50LnRleHRDb250ZW50ID0gc2VsZWN0LmRhdGFzZXQucGxhY2Vob2xkZXI7XG4gICAgICBzZWxlY3QuZGF0YXNldC52YWx1ZSA9ICcnO1xuICAgICAgY3VycmVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcpO1xuICAgIH1cbiAgfVxufVxuIiwiZnVuY3Rpb24gY2F0ZWdvcmllc1Byb2Nlc3MoKSB7XG4gICAgLy8g0LrQsNGC0LXQs9C+0YDQuNC4XG4gICAgY29uc3QgY2F0ZWdvcmllcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXRlZ29yaWVzX19saXN0Jyk7XG4gICAgY2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcbiAgICAgIGNvbnN0IGNob2ljZXMgPSBuZXcgQ2hvaWNlcyhjYXRlZ29yeSwge1xuICAgICAgICBzZWFyY2hFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgc2hvdWxkU29ydDogZmFsc2UsXG4gICAgICAgIGl0ZW1TZWxlY3RUZXh0OiAnJyxcbiAgICAgICAgYWxsb3dIVE1MOiB0cnVlLFxuICAgICAgICAvLyBwb3NpdGlvbjogJ2Rvd24nLFxuICAgICAgICBjaG9pY2VzOiBbXG4gICAgICAgICAgeyB2YWx1ZTogJ2VtcHR5JywgbGFiZWw6ICfQmtCw0YLQtdCz0L7RgNC40Y8nLCBzZWxlY3RlZDogdHJ1ZSwgZGlzYWJsZWQ6IHRydWUgfSxcbiAgICAgICAgICB7IHZhbHVlOiAn0JTQuNCy0LDQvdGLJywgbGFiZWw6ICfQlNC40LLQsNC90YsnIH0sXG4gICAgICAgICAgeyB2YWx1ZTogJ9Ca0YDQtdGB0LvQsCcsIGxhYmVsOiAn0JrRgNC10YHQu9CwJyB9LFxuICAgICAgICAgIHsgdmFsdWU6ICfQn9GD0YTRiycsIGxhYmVsOiAn0J/Rg9GE0YsnIH0sXG4gICAgICAgICAgeyB2YWx1ZTogJ9Ca0YDQvtCy0LDRgtC4JywgbGFiZWw6ICfQmtGA0L7QstCw0YLQuCcgfSxcbiAgICAgICAgICB7IHZhbHVlOiAn0KLRg9C80LHRiycsIGxhYmVsOiAn0KLRg9C80LHRiycgfSxcbiAgICAgICAgICB7IHZhbHVlOiAn0JrQvtC80L7QtNGLJywgbGFiZWw6ICfQmtC+0LzQvtC00YsnIH0sXG4gICAgICAgICAgeyB2YWx1ZTogJ9Ch0YLRg9C70YzRjycsIGxhYmVsOiAn0KHRgtGD0LvRjNGPJyB9LFxuICAgICAgICAgIHsgdmFsdWU6ICfQodGC0L7Qu9GLJywgbGFiZWw6ICfQodGC0L7Qu9GLJyB9LFxuICAgICAgICAgIHsgdmFsdWU6ICfQkNC60YHQtdGB0YHRg9Cw0YDRiycsIGxhYmVsOiAn0JDQutGB0LXRgdGB0YPQsNGA0YsnIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImNvbnN0IHJlY29yZHNQcm9jZXNzID0gZnVuY3Rpb24oKSB7XG4gIGRvdHRlZFByb2Nlc3MoJy5yZWNvcmRfX2RlbGltaXRlcicpXG59O1xuXG5jb25zdCBkb3R0ZWRQcm9jZXNzID0gZnVuY3Rpb24oc3RyaW5nVGFnKSB7XG4gIGNvbnN0IHRhZyA9IHN0cmluZ1RhZyB8fCAnLmRvdHRlZCBwJztcbiAgY29uc3QgZG90dGVkU3RyaW5ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGFnKTtcbiAgZG90dGVkU3RyaW5ncy5mb3JFYWNoKHN0ciA9PiB7XG4gICAgc3RyLnNldEF0dHJpYnV0ZSgnZGF0YS1jb250ZW50JywgJy4nLnJlcGVhdCgyMDApKTtcbiAgfSk7XG59O1xuXG4iLCJmdW5jdGlvbiBnb29kUHJvY2VzcygpIHtcbiAgY29uc3Qgc3dpcGVyT2ZmZXJzID0gbmV3IFN3aXBlcignLmdvb2QnLCB7XG4gICAgbG9vcDogZmFsc2UsXG4gICAgc3BhY2VCZXR3ZWVuOiAzMixcbiAgICBzbGlkZXNQZXJHcm91cDogMSxcbiAgICBzbGlkZXNQZXJWaWV3OiAyLFxuICAgIGF1dG9IZWlnaHQ6IGZhbHNlLFxuICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICAzMjA6IHsgLy8gd2hlbiB3aW5kb3cgd2lkdGggaXMgPj0gMzIwcHhcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMVxuICAgICAgfSxcbiAgICAgIDU3NjogeyAvLyB3aGVuIHdpbmRvdyB3aWR0aCBpcyA+PSA3NjhweFxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAyXG4gICAgICB9LFxuICAgICAgMTAyNDogeyAvLyB3aGVuIHdpbmRvdyB3aWR0aCBpcyA+PSAxMDI0cHhcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMyxcbiAgICAgIH0sXG4gICAgICAxMzUyOiB7XG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDJcbiAgICAgIH1cbiAgICB9LFxuICAgIG5hdmlnYXRpb246IHtcbiAgICAgIG5leHRFbDogXCIuZ29vZF9fYnRuLW5leHRcIixcbiAgICAgIHByZXZFbDogXCIuZ29vZF9fYnRuLXByZXZcIixcbiAgICAgIGRpc2FibGVkQ2xhc3M6ICdidG4taWNvbi0tZGlzYWJsZWQnLFxuICAgIH0sXG4gIH0pO1xufVxuIiwiZnVuY3Rpb24gbW9kYWxzUHJvY2VzcygpIHtcbiAgLy8gPyDQvtGH0LjRgdGC0LjRgtGMINC80L7QtNCw0LvRjNC90YvQuSDQtNC40LDQu9C+0LMg0L7RgiDQu9C40YjQvdC40YUg0LTQvtC/LiDRgdGC0LjQu9C10LlcbiAgZnVuY3Rpb24gcmVzZXRNb2RhbERpYWxvZ1N0eWxlcygpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtZGlhbG9nJykuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtZGlhbG9nLS1waG90bycpO1xuICB9XG4gIC8vID8g0LfQsNC60YDRi9GC0LjQtSDQvNC+0LTQsNC70LrQuCDRgdC+INGB0LLQvtGA0LDRh9C40LLQsNC90LjQtdC8INCy0YHQtdGFINCy0LjQtNC+0LIg0LzQvtC00LDQu9GM0L3Ri9GFINC+0LrQvtC9INCy0L3Rg9GC0YDQuFxuICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3NjYWxlLTEnKTsgLy8gPyDRgdC60YDRi9GC0Ywg0LzQvtC00LDQu9C60YMgKNC80LXQtNC70LXQvdC90L4pXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBbJ21vZGFsLWJ1eScsICdtb2RhbC1idXktY29uZmlybScsICdtb2RhbC1waG90byddLmZvckVhY2gobW9kYWxLaW5kTmFtZSA9PiB7IC8vID8g0LfQsNC60YDRi9GC0Ywg0LrQsNC20LTRi9C5INCy0LjQtCDQvNC+0LTQsNC70YzQvdC+0LPQviDQvtC60L3QsCDQstC90YPRgtGA0Lgg0LzQvtC00LDQu9C60LhcbiAgICAgICAgY29uc3QgbW9kYWxLaW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobW9kYWxLaW5kTmFtZSk7XG4gICAgICAgIGlmICghbW9kYWxLaW5kLmNsYXNzTGlzdC5jb250YWlucygnbm9uZScpKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobW9kYWxLaW5kTmFtZSkuY2xhc3NMaXN0LmFkZCgnbm9uZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlc2V0TW9kYWxEaWFsb2dTdHlsZXMoKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnc3RvcC1zY3JvbGwnKTsgLy8gPyDQstC60LvRjtGH0LjRgtGMINC/0YDQvtC70LjRgdGC0YvQstCw0L3QuNC1INGB0YLRgNCw0L3QuNGG0YtcblxuICAgIH0sIDMwMCk7XG4gIH1cblxuICAvLyAhINC+0YLQutGA0YvRgtC40LUg0LzQvtC00LDQu9C60Lgg0L/QviDQutC70LjQutGDINC90LAg0LvRjtCx0L7QuSDRjdC70LXQvNC10L3RgiDRgSDQutC70LDRgdGB0L7QvCBqcy1tb2RhbC1vcGVuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1tb2RhbC1vcGVuJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBjb25zdCBtb2RhbEtpbmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpdGVtLmRhdGFzZXQudGFyZ2V0KTsgLy8gPyDQsiB0YXJnZXQg0LfQsNC/0LjRgdGL0LLQsNC10YLRgdGPIGlkINCy0LjQtNCwINC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwINC00LvRjyDQvtGC0LrRgNGL0YLQuNGPLCDRgi7Qui4g0LLQuNC00L7QsiDQvdC10YHQutC+0LvRjNC60L5cbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnc3RvcC1zY3JvbGwnKTsgLy8gPyDRg9Cx0YDQsNGC0Ywg0L/RgNC+0LvQuNGB0YLRi9Cy0LDQvdC40LUg0YHRgtGA0LDQvdC40YbRi1xuICAgICAgbW9kYWxLaW5kLmNsYXNzTGlzdC5yZW1vdmUoJ25vbmUnKTsgLy8gPyDQvtGC0L7QsdGA0LDQt9C40YLRjCDQstC40LQg0LzQvtC00LDQu9GM0L3QvtCz0L4g0L7QutC90LAg0LLQvdGD0YLRgNC4INC80L7QtNCw0LvQutC4ICjQvtC90Lgg0LLRgdC1INC90LXQstC40LTQuNC80Ysg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4pXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwnKS5jbGFzc0xpc3QuYWRkKCdzY2FsZS0xJyk7IC8vID8g0L/QvtC60LDQt9Cw0YLRjCDQvNC+0LTQsNC70LrRgyAo0LzQtdC00LvQtdC90L3QvilcblxuICAgICAgY2hhbmdlTW9kYWxEaWFsb2dTdHlsZXMoaXRlbS5kYXRhc2V0LnRhcmdldCk7IC8vID8g0LjQt9C80LXQvdC40YLRjCDQtNC10YTQvtC70YLQvdGL0LUg0L3QsNGB0YLRgNC+0LnQutC4INC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQtNC40LDQu9C+0LPQsFxuXG4gICAgICAvLyA/INC10YHQu9C4INC80L7QtNCw0LvRjNC90L7QtSDQvtC60L3QviDRgSDRhNC+0YLQutCw0LzQuCwg0YPRgdGC0LDQvdC+0LLQuNGC0Ywg0L3Rg9C20L3Rg9GOINGE0L7RgtC+0LPRgNCw0YTQuNGOXG4gICAgICBjb25zdCBwaG90b0luZGV4ID0gaXRlbS5kYXRhc2V0Lm1vZGFsUGhvdG9JbmRleDtcbiAgICAgIG1vZGFsUGhvdG9NYWluU2xpZGVyLmFjdGl2ZUluZGV4ID0gcGhvdG9JbmRleDsgLy8gISAtLS0tLS0tLT4g0L/QvtGH0LXQvNGDINC90LUg0YDQsNCx0L7RgtCw0LXRgj8hXG4gICAgfSlcbiAgfSk7XG5cbiAgLy8g0LjQt9C80LXQvdC40YLRjCDQtNC10YTQvtC70YLQvdGL0LUg0L3QsNGB0YLRgNC+0LnQutC4INC80L7QtNCw0LvRjNC90L7Qs9C+INC00LjQsNC70L7Qs9CwLCDQtdGB0LvQuCDRgtGA0LXQsdGD0LXRgtGB0Y9cbiAgZnVuY3Rpb24gY2hhbmdlTW9kYWxEaWFsb2dTdHlsZXMobW9kYWxLaW5kTmFtZSkge1xuICAgIGNvbnN0IG1vZGFsRGlhbG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWRpYWxvZycpO1xuXG4gICAgaWYgKG1vZGFsS2luZE5hbWUgPT09ICdtb2RhbC1waG90bycpIHtcbiAgICAgIG1vZGFsRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ21vZGFsLWRpYWxvZy0tcGhvdG8nKTtcbiAgICB9XG4gIH1cblxuICAvLyAhINC30LDQutGA0YvRgtC40LUg0LzQvtC00LDQu9C60LhcbiAgLy8gMS4g0L/RgNC4INC60LvQuNC60LUg0LLQvdC1INC00LjQsNC70L7Qs9CwXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbCcpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgaWYgKGUuX2lzQ2xpY2tXaXRoaW5Nb2RhbERpYWxvZykgcmV0dXJuO1xuICAgIGNsb3NlTW9kYWwoKTtcbiAgfSlcblxuICAvLyAyLiDQv9GA0Lgg0LrQu9C40LrQtSDQvdCwINC60YDQtdGB0YLQuNC6XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1jbG9zZScpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsb3NlTW9kYWwoKTtcbiAgfSk7XG5cbiAgLy8gISDRg9GB0YLQsNC90L7QstC60LAg0L/RgNC+0LLQtdGA0LrQuCDQvdCwINC60LvQuNC6INCy0L3Rg9GC0YDQuCDQtNC40LDQu9C+0LPQsFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtZGlhbG9nJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLl9pc0NsaWNrV2l0aGluTW9kYWxEaWFsb2cgPSB0cnVlO1xuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyAhINGA0LDQsdC+0YLQsCDRgSDQvNC+0LTQsNC70YzQvdC+0Lkg0YTQvtGA0LzQvtC5XG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtZGlhbG9nLWJ1eS1mb3JtJykpIHtcbiAgICAvLyAhINCy0LDQu9C40LTQsNGG0LjRj1xuICAgIGNvbnN0IGlucHV0TW9kYWxGb3JtUGhvbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtZGlhbG9nLWJ1eS1waG9uZScpO1xuICAgIGNvbnN0IHZhbGlkYXRpb25Nb2RhbEJ1eSA9IG5ldyBKdXN0VmFsaWRhdGUoJyNtb2RhbC1kaWFsb2ctYnV5LWZvcm0nLCB7XG4gICAgICBmb2N1c0ludmFsaWRGaWVsZDogdHJ1ZSxcbiAgICAgIHZhbGlkYXRlQmVmb3JlU3VibWl0dGluZzogdHJ1ZSxcbiAgICAgIC8vIGVycm9yc0NvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsaWVudC1lcnJvcicpLFxuICAgICAgZXJyb3JGaWVsZENzc0NsYXNzOiAnaW52YWxpZGF0ZWQnLFxuICAgIH0pXG4gICAgICAuYWRkRmllbGQoJyNtb2RhbC1kaWFsb2ctYnV5LWZpbycsIFtcbiAgICAgICAge1xuICAgICAgICAgIHJ1bGU6ICdyZXF1aXJlZCcsXG4gICAgICAgICAgZXJyb3JNZXNzYWdlOiAn0JLQstC10LTQuNGC0LUg0KTQmNCeJyxcbiAgICAgICAgfVxuICAgICAgXSlcbiAgICAgIC5hZGRGaWVsZCgnI21vZGFsLWRpYWxvZy1idXktcGhvbmUnLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBydWxlOiAncmVxdWlyZWQnLFxuICAgICAgICAgIGVycm9yTWVzc2FnZTogYNCS0LLQtdC00LjRgtC1INC90L7QvNC10YBgLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsdWUsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnN0IG51bVZhbHVlID0gaW5wdXRNb2RhbEZvcm1QaG9uZS5pbnB1dG1hc2sudW5tYXNrZWR2YWx1ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIEJvb2xlYW4oTnVtYmVyKG51bVZhbHVlKSAmJiBudW1WYWx1ZS5sZW5ndGggPT09IDEwKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yTWVzc2FnZTogJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQvdC+0LzQtdGAJyxcbiAgICAgICAgfSxcbiAgICAgIF0pO1xuICAgIC8vIC5hZGRGaWVsZCgnI3JlcXVlc3QtZW1haWwnLCBbXG4gICAgLy8gICB7XG4gICAgLy8gICAgIHJ1bGU6ICdyZXF1aXJlZCcsXG4gICAgLy8gICAgIGVycm9yTWVzc2FnZTogJ9CS0LLQtdC00LjRgtC1IGUtbWFpbCcsXG4gICAgLy8gICB9LFxuICAgIC8vICAge1xuICAgIC8vICAgICBydWxlOiAnZW1haWwnLFxuICAgIC8vICAgICBlcnJvck1lc3NhZ2U6ICfQndC10L/RgNCw0LLQuNC70YzQvdGL0Lkg0YTQvtGA0LzQsNGCJyxcbiAgICAvLyAgIH1cbiAgICAvLyBdKTtcblxuICAgIHZhbGlkYXRpb25Nb2RhbEJ1eS5yZXZhbGlkYXRlKCk7IC8vINC90YPQttC90LAg0YDQtdCy0LDQu9C40LTQsNGG0LjRjywg0YfRgtC+0LHRiyDQv9GA0Lgg0L7RgtC60YDRi9GC0LjQuCDRhNC+0YDQvNGLINC4INGB0YDQsNC30YMg0LbQtSDQvdCw0LbQsNGC0LjQuCBcItCe0YLQv9GA0LDQstC40YLRjFwiINC90LUg0L/RgNC+0LjRgdGF0L7QtNC40LvQsCDQvtGC0L/RgNCw0LLQutCwINC/0YPRgdGC0YvRhSDQtNCw0L3QvdGL0YVcblxuICAgIC8vICEgc3VibWl0INC80L7QtNCw0LvRjNC90L7QuSDRhNC+0YDQvNGLXG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1kaWFsb2ctYnV5LWZvcm0nKTtcbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoIWZvcm0ucXVlcnlTZWxlY3RvcignLmludmFsaWRhdGVkJykpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1eScpLmNsYXNzTGlzdC5hZGQoJ25vbmUnKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJ1eS1jb25maXJtJykuY2xhc3NMaXN0LnJlbW92ZSgnbm9uZScpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gISDRgNCw0LHQvtGC0LAg0YEg0LzQvtC00LDQu9GM0L3Ri9C80Lgg0YHQu9Cw0LnQtNC10YDQsNC80LhcbiAgLy8g0YHQv9C40YHQvtC6INC80LDQu9C10L3RjNC60LjRhSDRhNC+0YLQvlxuICBjb25zdCBtb2RhbFBob3RvTGlzdFNsaWRlciA9IG5ldyBTd2lwZXIoXCIubW9kYWwtZGlhbG9nX19waG90by1saXN0LXN3aXBlclwiLCB7XG4gICAgc3BhY2VCZXR3ZWVuOiA3OCxcbiAgICBzbGlkZXNQZXJWaWV3OiA0LFxuICAgIC8vIGZyZWVNb2RlOiB0cnVlLCAvLyAtLS0tLT4g0YHQstC+0LHQvtC00L3QvtC1INC/0LXRgNC10LvQuNGB0YLRi9Cy0LDQvdC40LUg0LHQtdC3INGB0LrQsNGH0LrQvtCyXG4gICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcbiAgICBicmVha3BvaW50czoge1xuICAgICAgMzIwOiB7XG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDEsXG4gICAgICB9LFxuICAgICAgNTc2OiB7XG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXG4gICAgICAgIHNwYWNlQmV0d2VlbjogMzksXG4gICAgICB9LFxuICAgICAgNzY4OiB7XG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXG4gICAgICAgIHNwYWNlQmV0d2VlbjogNzgsXG4gICAgICB9LFxuICAgICAgMTAyNDoge1xuICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxuICAgICAgICBzcGFjZUJldHdlZW46IDc4LFxuICAgICAgfSxcbiAgICAgIDEzNTI6IHtcbiAgICAgICAgc2xpZGVzUGVyVmlldzogNCxcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiA3OCxcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcbiAgLy8g0LPQu9Cw0LLQvdC+0LUg0LHQvtC70YzRiNC+0LUg0YTQvtGC0L5cbiAgY29uc3QgbW9kYWxQaG90b01haW5TbGlkZXIgPSBuZXcgU3dpcGVyKFwiLm1vZGFsLWRpYWxvZ19fcGhvdG8tbWFpbi1zd2lwZXJcIiwge1xuICAgIHNwYWNlQmV0d2VlbjogMTAsXG4gICAgbmF2aWdhdGlvbjoge1xuICAgICAgbmV4dEVsOiBcIi5tb2RhbC1kaWFsb2dfX3Bob3RvLWJ1dHRvbi1uZXh0XCIsXG4gICAgICBwcmV2RWw6IFwiLm1vZGFsLWRpYWxvZ19fcGhvdG8tYnV0dG9uLXByZXZcIixcbiAgICAgIGRpc2FibGVkQ2xhc3M6ICdidG4taWNvbi0tZGlzYWJsZWQnLFxuICAgIH0sXG4gICAgdGh1bWJzOiB7XG4gICAgICBzd2lwZXI6IG1vZGFsUGhvdG9MaXN0U2xpZGVyLFxuICAgIH0sXG4gIH0pO1xufVxuIiwiZnVuY3Rpb24gb2ZmZXJzUHJvY2VzcygpIHtcbiAgY29uc3Qgc3dpcGVyT2ZmZXJzID0gbmV3IFN3aXBlcignLm9mZmVycycsIHtcbiAgICBsb29wOiBmYWxzZSxcbiAgICBzcGFjZUJldHdlZW46IDMyLFxuICAgIHNsaWRlc1Blckdyb3VwOiAzLFxuICAgIHNsaWRlc1BlclZpZXc6IDMsXG4gICAgYXV0b0hlaWdodDogZmFsc2UsXG4gICAgYnJlYWtwb2ludHM6IHtcbiAgICAgIDMyMDogeyAvLyB3aGVuIHdpbmRvdyB3aWR0aCBpcyA+PSAzMjBweFxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAxLFxuICAgICAgICBzbGlkZXNQZXJHcm91cDogMVxuICAgICAgfSxcbiAgICAgIDc2ODogeyAvLyB3aGVuIHdpbmRvdyB3aWR0aCBpcyA+PSA3NjhweFxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAyLFxuICAgICAgICBzbGlkZXNQZXJHcm91cDogMVxuICAgICAgfSxcbiAgICAgIDEwMjQ6IHsgLy8gd2hlbiB3aW5kb3cgd2lkdGggaXMgPj0gMTAyNHB4XG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDMsXG4gICAgICAgIHNsaWRlc1Blckdyb3VwOiAxXG4gICAgICB9LFxuICAgICAgMTM1Mjoge1xuICAgICAgICBzbGlkZXNQZXJHcm91cDogM1xuICAgICAgfVxuICAgIH0sXG4gICAgbmF2aWdhdGlvbjoge1xuICAgICAgbmV4dEVsOiBcIi5vZmZlcnNfX2J0bi1uZXh0XCIsXG4gICAgICBwcmV2RWw6IFwiLm9mZmVyc19fYnRuLXByZXZcIixcbiAgICAgIGRpc2FibGVkQ2xhc3M6ICdidG4taWNvbi0tZGlzYWJsZWQnLFxuICAgIH0sXG4gIH0pO1xufVxuIiwiZnVuY3Rpb24gcHJvZHVjdFByb2Nlc3MoKSB7XG5cbiAgLy8gISDQvNC40L3QuC3RhNC+0YLQutC4INC/0LXRgNC10LvQuNGB0YLRi9Cy0LDRjtGC0YHRjyDQsdC10Lcg0YHQutGA0L7Qu9C70LAsINC90LAg0YLQsNGH0YHQutGA0LjQvdCw0YUsINC70LjQsdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDRgdGA0LXQtNC90LXQuSDQutC90L7Qv9C60Lgg0LzRi9GI0LhcbiAgLy8gLy8g0L7RgdC90L7QstC90YvQtSDRhNC+0YLQvtCz0YDQsNGE0LjQuFxuICAvLyBjb25zdCBwaG90b3MgPSBuZXcgU3dpcGVyKFwiLnByb2R1Y3QtcGhvdG9zLXN3aXBlclwiLCB7XG4gIC8vICAgc3BhY2VCZXR3ZWVuOiAxLFxuICAvLyAgIHNsaWRlc1BlclZpZXc6IDEsXG4gIC8vICAgZnJlZU1vZGU6IGZhbHNlLFxuICAvLyAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gIC8vICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gIC8vIH0pO1xuXG4gIC8vIC8vINC80LjQvdC4LdC60L7Qv9C40Lgg0YTQvtGC0L7Qs9GA0LDRhNC40LlcbiAgLy8gY29uc3QgcGhvdG9zTGlzdCA9IG5ldyBTd2lwZXIoXCIucHJvZHVjdC1waG90b3MtbGlzdC1zd2lwZXJcIiwge1xuICAvLyAgIHNwYWNlQmV0d2VlbjogMzgsXG4gIC8vICAgc2xpZGVzUGVyVmlldzogJ2F1dG8tZmlsJyxcbiAgLy8gICBmcmVlTW9kZTogdHJ1ZSxcbiAgLy8gICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAvLyAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICAvLyAgIGJyZWFrcG9pbnRzOiB7XG4gIC8vICAgICAzMjA6IHtcbiAgLy8gICAgICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gIC8vICAgICB9LFxuICAvLyAgICAgNTc2OiB7XG4gIC8vICAgICAgIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyxcbiAgLy8gICAgIH0sXG4gIC8vICAgICAxMDI0OiB7XG4gIC8vICAgICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICAvLyAgICAgfSxcbiAgLy8gICB9XG4gIC8vIH0pO1xuXG4gIC8vINC30LDQvNC10L3QsCDQuNC30L7QsdGA0LDQttC10L3QuNGPINC/0L4g0YnQtdC70YfQutGDINC80YvRiNC4INC90LAg0YHQv9C40YHQutC4INC80LjQvdC4LdC60LDRgNGC0LjQvdC+0LpcbiAgY29uc3QgbGlzdEltZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1pbWcnKTtcbiAgaWYgKGxpc3RJbWdzICYmIGxpc3RJbWdzLmxlbmd0aCkge1xuICAgIGxpc3RJbWdzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgY29uc3QgYmlnSW1nVVJMID0gaXRlbS5kYXRhc2V0LmJpbWFnZTtcbiAgICAgICAgY29uc3QgYmlnSW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JpZy1pbWcnKTtcbiAgICAgICAgYmlnSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgYmlnSW1nVVJMKTtcblxuICAgICAgICAvLyA/INGB0L7RhdGA0LDQvdC40YLRjCDQuNC90LTQtdC60YEg0LjQt9C+0LHRgNCw0LbQtdC90LjRjywg0LrQvtGC0L7RgNGL0Lkg0LHRg9C00LXRgiDQvtGC0L7QsdGA0LDQttC10L0g0LIg0LzQvtC00LDQu9GM0L3QvtC8INC+0LrQvdC1INC/0YDQuCDRidC10LvRh9C60LUg0L3QsCDQsdC+0LvRjNGI0L7QtSDRhNC+0YLQvlxuICAgICAgICBjb25zdCBpbWdQYXJlbnQgPSBiaWdJbWcuY2xvc2VzdCgnLnByb2R1Y3QtcGhvdG8tbWFpbicpO1xuICAgICAgICBpbWdQYXJlbnQuZGF0YXNldC5tb2RhbFBob3RvSW5kZXggPSA0OyAvLyAhIC0tLS0tPiDRgdC+0YXRgNCw0L3Rj9GOINC90L7QvNC10YAsINC90L4g0LIgbW9kYWwuanMg0LjQt9C80LXQvdC10L3QuNC1IGFjdGl2ZVNsaWRlINCyINGB0YLRgC4zMyDQvdC1INGA0LDQsdC+0YLQsNC10YIhXG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgLy8gISDQvtGC0LrRgNGL0YLQuNC1INC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwINGB0L4g0YHQu9Cw0LnQtNC10YDQsNC80Lgg0LjQt9C+0LHRgNCw0LbQtdC90LjQuSA9PT09PiDRgdC8LiBtb2RhbC5qc1xuICAvLyBjb25zdCBwcm9kUGhvdG9zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2R1Y3QtcGhvdG9zJyk7XG4gIC8vIGlmIChwcm9kUGhvdG9zKSB7XG4gIC8vICAgcHJvZFBob3Rvcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gIC8vICAgICBhbGVydCgn0LfQtNGA0LDQsiDQsdGD0LTQtSwg0LHQvtGP0YDQuNC9IScpO1xuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgLy8gISDRgdC70LDQudC00LXRgCDRgSDQv9C+0YXQvtC20LjQvNC4INGC0L7QstCw0YDQsNC80LhcbiAgY29uc3Qgc3dpcGVyU2FtZSA9IG5ldyBTd2lwZXIoJy5zYW1lJywge1xuICAgIGxvb3A6IGZhbHNlLFxuICAgIHNwYWNlQmV0d2VlbjogMzIsXG4gICAgc2xpZGVzUGVyR3JvdXA6IDEsXG4gICAgc2xpZGVzUGVyVmlldzogNCxcbiAgICBhdXRvSGVpZ2h0OiBmYWxzZSxcbiAgICBicmVha3BvaW50czoge1xuICAgICAgMzIwOiB7IC8vIHdoZW4gd2luZG93IHdpZHRoIGlzID49IDMyMHB4XG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXG4gICAgICAgIHNwYWNlQmV0d2VlbjogMTYsXG4gICAgICB9LFxuICAgICAgNTc2OiB7IC8vIHdoZW4gd2luZG93IHdpZHRoIGlzID49IDc2OHB4XG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXG4gICAgICAgIHNwYWNlQmV0d2VlbjogMzJcbiAgICAgIH0sXG4gICAgICAxMDI0OiB7IC8vIHdoZW4gd2luZG93IHdpZHRoIGlzID49IDEwMjRweFxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxuICAgICAgfSxcbiAgICAgIDEzNTI6IHtcbiAgICAgICAgc2xpZGVzUGVyVmlldzogNFxuICAgICAgfVxuICAgIH0sXG4gICAgbmF2aWdhdGlvbjoge1xuICAgICAgbmV4dEVsOiBcIi5zYW1lX19idG4tbmV4dFwiLFxuICAgICAgcHJldkVsOiBcIi5zYW1lX19idG4tcHJldlwiLFxuICAgICAgZGlzYWJsZWRDbGFzczogJ2J0bi1pY29uLS1kaXNhYmxlZCcsXG4gICAgfSxcbiAgfSk7XG5cbn1cbiIsImZ1bmN0aW9uIHJlcXVlc3RzUHJvY2VzcygpIHtcbiAgLy8g0YXQuNC90YJcbiAgdGlwcHkoJy5yZXF1ZXN0X19oaW50Jywge1xuICAgIGNvbnRlbnQ6ICfQoNC10L/Qu9C40YbQuNGA0L7QstCw0L3QvdGL0LUg0YEg0LfQsNGA0YPQsdC10LbQvdGL0YUg0LjRgdGC0L7Rh9C90LjQutC+0LIsINC40YHRgdC70LXQtNC+0LLQsNC90LjRjyDRhNC+0YDQvNC40YDRg9GO0YIg0LPQu9C+0LHQsNC70YzQvdGD0Y4g0YHQtdGC0YwuJyxcbiAgICBhbGxvd0hUTUw6IHRydWUsXG4gICAgaW50ZXJhY3RpdmU6IHRydWUsXG4gICAgdGhlbWU6ICdtYWluJyxcbiAgICBtYXhXaWR0aDogMTU3XG4gIH0pO1xuXG4gIGNvbnN0IGlucHV0RmlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmlucHV0LWZpbycpO1xuICBjb25zdCBpbnB1dHNQaG9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnB1dC1waG9uZScpO1xuICBjb25zdCBpbnB1dEVtYWlsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmlucHV0LWVtYWlsJyk7XG5cbiAgZm9yIChsZXQgaW5wdXRQaG9uZSBvZiBpbnB1dHNQaG9uZSkge1xuICAgIC8vINC80LDRgdC60Lgg0LLQstC+0LTQsFxuICAgIElucHV0bWFzayh7IG1hc2s6ICcrNyAoOTk5KSA5OTktOTktOTknIH0pLm1hc2soaW5wdXRQaG9uZSk7XG5cbiAgICAvLyDQstCw0LvQuNC00LDRhtC40Y9cbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlcXVlc3QtZm9ybScpKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uID0gbmV3IEp1c3RWYWxpZGF0ZSgnI3JlcXVlc3QtZm9ybScsIHtcbiAgICAgICAgZm9jdXNJbnZhbGlkRmllbGQ6IHRydWUsXG4gICAgICAgIHZhbGlkYXRlQmVmb3JlU3VibWl0dGluZzogdHJ1ZSxcbiAgICAgICAgLy8gZXJyb3JzQ29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xpZW50LWVycm9yJyksXG4gICAgICAgIGVycm9yRmllbGRDc3NDbGFzczogJ2ludmFsaWRhdGVkJyxcbiAgICAgIH0pXG4gICAgICAgIC5hZGRGaWVsZCgnI3JlcXVlc3QtZmlvJywgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJ1bGU6ICdyZXF1aXJlZCcsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICfQktCy0LXQtNC40YLQtSDQpNCY0J4nLFxuICAgICAgICAgIH1cbiAgICAgICAgXSlcbiAgICAgICAgLmFkZEZpZWxkKCcjcmVxdWVzdC1waG9uZScsIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBydWxlOiAncmVxdWlyZWQnLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBg0JLQstC10LTQuNGC0LUg0L3QvtC80LXRgGAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWx1ZSwgY29udGV4dCkge1xuICAgICAgICAgICAgICBjb25zdCBudW1WYWx1ZSA9IGlucHV0UGhvbmUuaW5wdXRtYXNrLnVubWFza2VkdmFsdWUoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIEJvb2xlYW4oTnVtYmVyKG51bVZhbHVlKSAmJiBudW1WYWx1ZS5sZW5ndGggPT09IDEwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L3QvtC80LXRgCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSlcbiAgICAgICAgLmFkZEZpZWxkKCcjcmVxdWVzdC1lbWFpbCcsIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBydWxlOiAncmVxdWlyZWQnLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAn0JLQstC10LTQuNGC0LUgZS1tYWlsJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJ1bGU6ICdlbWFpbCcsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6ICfQndC10L/RgNCw0LLQuNC70YzQvdGL0Lkg0YTQvtGA0LzQsNGCJyxcbiAgICAgICAgICB9XG4gICAgICAgIF0pO1xuXG4gICAgICAvLyB2YWxpZGF0aW9uLnJldmFsaWRhdGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
