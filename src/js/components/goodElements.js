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
