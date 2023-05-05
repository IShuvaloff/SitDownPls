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
