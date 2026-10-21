const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
  const text = menuButton?.querySelector('.sr-only');
  if (text) text.textContent = 'Open menu';
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
  menuButton.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

document.querySelectorAll('[data-select-service]').forEach(link => {
  link.addEventListener('click', () => {
    const checkbox = [...document.querySelectorAll('input[name="services"]')].find(input => input.value === link.dataset.selectService);
    if (checkbox) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
});

const imageDialog = document.querySelector('#image-dialog');
document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    const image = imageDialog.querySelector('img');
    imageDialog.dataset.photo = button.dataset.photo || 'landscape';
    image.src = button.dataset.image;
    image.alt = button.querySelector('img').alt;
    imageDialog.querySelector('p').textContent = button.dataset.caption;
    imageDialog.showModal();
  });
});
imageDialog?.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
imageDialog?.addEventListener('click', event => {
  if (event.target !== imageDialog) return;
  const bounds = imageDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) imageDialog.close();
});
