var bioElement = document.getElementById('artist-bio');
if (bioElement) {
  bioElement.textContent = window.artistBio || '';
}

var profileImage = document.querySelector('.profile-image-flip');
if (profileImage) {
  var mobilePortraitQuery = window.matchMedia('(max-width: 767px)');
  var updatePortraitInteraction = function () {
    if (mobilePortraitQuery.matches) {
      profileImage.setAttribute('role', 'button');
      profileImage.setAttribute('tabindex', '0');
      profileImage.setAttribute('aria-pressed', profileImage.classList.contains('is-flipped'));
      return;
    }

    profileImage.removeAttribute('role');
    profileImage.removeAttribute('tabindex');
    profileImage.removeAttribute('aria-pressed');
    profileImage.classList.remove('is-flipped');
  };
  var togglePortrait = function () {
    if (!mobilePortraitQuery.matches) {
      return;
    }

    var isFlipped = profileImage.classList.toggle('is-flipped');
    profileImage.setAttribute('aria-pressed', isFlipped);
  };

  profileImage.addEventListener('click', togglePortrait);
  profileImage.addEventListener('keydown', function (event) {
    if (mobilePortraitQuery.matches && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      togglePortrait();
    }
  });
  mobilePortraitQuery.addEventListener('change', updatePortraitInteraction);
  updatePortraitInteraction();

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var profileImageInner = profileImage.querySelector('.profile-image-flip-inner');
    var finishIntroFlip = function (event) {
      if (event.animationName === 'profile-image-reveal') {
        profileImage.classList.remove('is-intro-flipping');
        profileImageInner.removeEventListener('animationend', finishIntroFlip);
      }
    };

    profileImageInner.addEventListener('animationend', finishIntroFlip);
    profileImage.classList.add('is-intro-flipping');
  }
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

var themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

var projectDialog = document.getElementById('project-dialog');
if (projectDialog) {
  var projectDialogTitle = document.getElementById('project-dialog-title');
  var projectDialogClose = projectDialog.querySelector('.project-dialog-close');
  var projectPopups = projectDialog.querySelectorAll('.project-popup-gallery');

  document.querySelectorAll('.work-project-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var projectName = card.querySelector('.work-project-title').textContent;
      var projectId = card.dataset.project;

      projectDialogTitle.textContent = projectName;
      projectPopups.forEach(function (popup) {
        popup.hidden = popup.dataset.popupProject !== projectId;
      });
      projectDialog.showModal();
    });
  });

  projectDialogClose.addEventListener('click', function () {
    projectDialog.close();
  });

  projectDialog.addEventListener('click', function (event) {
    if (event.target === projectDialog) {
      projectDialog.close();
    }
  });

  projectDialog.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      projectDialog.close();
    }
  });

  var imageDialog = document.getElementById('image-dialog');
  var enlargedArtwork = document.getElementById('enlarged-artwork');
  var imageDialogClose = imageDialog.querySelector('.image-dialog-close');
  var previousArtwork = imageDialog.querySelector('.image-dialog-previous');
  var nextArtwork = imageDialog.querySelector('.image-dialog-next');
  var activeProjectImages = [];
  var activeImageIndex = 0;
  var imageFlashTimeout;

  var showEnlargedImage = function () {
    var activeImage = activeProjectImages[activeImageIndex];
    enlargedArtwork.src = activeImage.src;
    enlargedArtwork.alt = activeImage.alt;
    previousArtwork.disabled = activeProjectImages.length < 2;
    nextArtwork.disabled = activeProjectImages.length < 2;
  };

  var flashImageDialog = function () {
    window.clearTimeout(imageFlashTimeout);
    imageDialog.classList.remove('is-transitioning');
    void imageDialog.offsetWidth;
    imageDialog.classList.add('is-transitioning');
    imageFlashTimeout = window.setTimeout(function () {
      imageDialog.classList.remove('is-transitioning');
    }, 1050);
  };

  var changeEnlargedImage = function (direction) {
    activeImageIndex = (activeImageIndex + direction + activeProjectImages.length) % activeProjectImages.length;
    showEnlargedImage();
    flashImageDialog();
  };

  projectDialog.querySelectorAll('.project-popup-gallery img').forEach(function (image) {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', 'Enlarge: ' + image.alt);

    var openEnlargedImage = function () {
      activeProjectImages = Array.from(image.closest('.project-popup-gallery').querySelectorAll('img'));
      activeImageIndex = activeProjectImages.indexOf(image);
      showEnlargedImage();
      imageDialog.showModal();
    };

    image.addEventListener('click', openEnlargedImage);
    image.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openEnlargedImage();
      }
    });
  });

  imageDialogClose.addEventListener('click', function () {
    imageDialog.close();
  });

  previousArtwork.addEventListener('click', function () {
    changeEnlargedImage(-1);
  });

  nextArtwork.addEventListener('click', function () {
    changeEnlargedImage(1);
  });

  imageDialog.addEventListener('click', function (event) {
    if (event.target === imageDialog) {
      imageDialog.close();
    }
  });

  imageDialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      changeEnlargedImage(event.key === 'ArrowLeft' ? -1 : 1);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      imageDialog.close();
    }
  });

}

if (JSON.parse(localStorage.getItem('dark-theme'))) {
  document.body.classList.add('dark');
}
