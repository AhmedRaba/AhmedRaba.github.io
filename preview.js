const languageControls = document.querySelector('.languages');
const languageButtons = languageControls.querySelectorAll('button');
const screen = document.querySelector('#app-preview');
const title = document.querySelector('#app-title');
const count = document.querySelector('#app-count');

const homeScreen = {
  ar: { direction: 'rtl', title: 'ورقي', count: 'لا توجد مستندات' },
  en: { direction: 'ltr', title: 'Waraqy', count: '0 documents' },
};

for (const button of languageButtons) {
  button.addEventListener('click', () => {
    const language = button.dataset.language;
    const translation = homeScreen[language];
    screen.lang = language;
    screen.dir = translation.direction;
    title.textContent = translation.title;
    count.textContent = translation.count;

    for (const languageButton of languageButtons) {
      languageButton.setAttribute('aria-pressed', String(languageButton === button));
    }
  });
}

languageControls.hidden = false;
