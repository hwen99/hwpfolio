const navCollections = [...document.querySelectorAll('.nav-collection')];

for (const collection of navCollections) {
  const summary = collection.querySelector('summary');

  summary.addEventListener('click', (event) => {
    // Keep the second click from closing the menu before double-click navigation.
    if (event.detail > 1) event.preventDefault();
    for (const other of navCollections) {
      if (other !== collection) other.open = false;
    }
  });

  summary.addEventListener('dblclick', (event) => {
    event.preventDefault();
    window.location.assign(summary.dataset.overview);
  });

  collection.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && collection.open) {
      event.preventDefault();
      collection.open = false;
      summary.focus();
    }
    if (event.key === 'ArrowDown' && event.target === summary) {
      event.preventDefault();
      for (const other of navCollections) other.open = other === collection;
      collection.querySelector('.nav-dropdown a').focus();
    }
  });
}

const closeOutsideCollections = (event) => {
  for (const collection of navCollections) {
    if (!collection.contains(event.target)) collection.open = false;
  }
};

document.addEventListener('click', closeOutsideCollections);
document.addEventListener('focusin', closeOutsideCollections);
