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
