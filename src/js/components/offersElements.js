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
