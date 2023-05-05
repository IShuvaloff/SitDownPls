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
