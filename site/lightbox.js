const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
const closeButton = lightbox?.querySelector('.lightbox-close');
let opener;

const closeLightbox = () => lightbox?.close();

if (lightbox && lightboxImage && lightboxCaption && closeButton) {
  document.querySelectorAll('main img').forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Expand image: ${image.alt}`);

    const openLightbox = () => {
      opener = image;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.alt;
      lightbox.showModal();
      closeButton.focus();
    };

    image.addEventListener('click', openLightbox);
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox();
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('close', () => {
    lightboxImage.src = '';
    opener?.focus();
  });
}
