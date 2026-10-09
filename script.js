var bioElement = document.getElementById('artist-bio');
if (bioElement) {
  bioElement.textContent = window.artistBio || '';
}

var yearElement = document.getElementById('current-year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

var contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var formData = new FormData(contactForm);
    var subject = 'Portfolio contact from ' + formData.get('name');
    var body = [
      'Name: ' + formData.get('name'),
      'Email: ' + formData.get('email'),
      '',
      formData.get('message')
    ].join('\n');
    var mailtoUrl = 'mailto:helennmarley@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    var emailLink = document.createElement('a');
    emailLink.href = mailtoUrl;
    emailLink.hidden = true;
    document.body.appendChild(emailLink);
    emailLink.click();
    emailLink.remove();
  });
}

var toggleTheme = function () {
  document.body.classList.toggle('dark');
  localStorage.setItem('dark-theme', document.body.classList.contains('dark'));
};

var toggleLightroom = function (event) {
  if (event.target.className === 'lightroom') {
    event.target.classList.remove('lightroom');
    return;
  }

  if (!event.target.parentElement.parentElement.classList.contains('image-card')) {
    return;
  }

  if (!event.target.parentElement.classList.contains('lightroom')) {
    event.target.parentElement.classList.add('lightroom');
    return;
  }
};

var themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

var worksSection = document.getElementById('works');
if (worksSection) {
  worksSection.addEventListener('click', function (event) {
    toggleLightroom(event);
  });
}

if (JSON.parse(localStorage.getItem('dark-theme'))) {
  document.body.classList.add('dark');
}
