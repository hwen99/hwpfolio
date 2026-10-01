const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle?.querySelector('[aria-hidden="true"]');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

const savedTheme = () => {
  try {
    const theme = localStorage.getItem('theme');
    return theme === 'light' || theme === 'dark' ? theme : null;
  } catch {
    return null;
  }
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  if (!themeToggle || !themeIcon) return;

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${nextTheme} mode`;
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
  themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
};

applyTheme(document.documentElement.dataset.theme || (systemTheme.matches ? 'dark' : 'light'));

themeToggle?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // The selected theme still applies for the current page when storage is unavailable.
  }
  applyTheme(theme);
});

systemTheme.addEventListener('change', (event) => {
  if (!savedTheme()) applyTheme(event.matches ? 'dark' : 'light');
});
