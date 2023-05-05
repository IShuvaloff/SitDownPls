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
