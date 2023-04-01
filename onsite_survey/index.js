// setup phone input
const input = document.querySelector("#phone-number-input");
const config = {
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/utils.js",
  // separateDialCode: true,
  initialCountry: "auto",
  geoIpLookup: (success, failure) => {
    $.get(
      "https://ipinfo.io",
      () => {},
      "jsonp"
    ).always((resp) => {
        const countryCode = (resp && resp.country) ? resp.country : '';
        success(countryCode);
    });
  }
};
const iti = window.intlTelInput(input, config);

const emailInputEl = document.querySelector('#email-input');
const emailInputErrorEl = document.querySelector('#email-input-error');

const phoneInputEl = document.querySelector('#phone-number-input');
const phoneInputErrorEl = document.querySelector('#phone-number-input-error');

const form = document.querySelector('#survey-form');

const callbackWithCleanup = (callback, cleanup, timeout = 2000) => {
  callback();
  setTimeout(() => cleanup(), timeout);
};
const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

const handleFormSubmit = (event) => {
  event.preventDefault();
    
  const formData = new FormData(form);
  const email = formData.get('email');
  const phone = formData.get('phone');

  let isFormValid = true; 

  // error: empty email field
  if (email === '') {
    isFormValid = false;
    callbackWithCleanup(
      () => {
        emailInputErrorEl.innerText = 'Required field';
        emailInputErrorEl.classList.add('show');
      },
      () => {
        emailInputErrorEl.innerText = 'error';
        emailInputErrorEl.classList.remove('show');
      },
    );
  }

  // error: invalid email address
  if (!isValidEmail(email)) {
    isFormValid = false;
    callbackWithCleanup(
      () => {
        emailInputErrorEl.innerText = 'You have entered an invalid email address';
        emailInputErrorEl.classList.add('show');
      },
      () => {
        emailInputErrorEl.innerText = 'error';
        emailInputErrorEl.classList.remove('show');
      },
    );
  }

  // mobile number validation
  if (phone.length != 10) {
    isFormValid = false;
    callbackWithCleanup(
      () => {
        phoneInputErrorEl.innerText = 'You have entered an invalid Mobile number';
        phoneInputErrorEl.classList.add('show');
      },
      () => {
        phoneInputErrorEl.innerText = 'error';
        phoneInputErrorEl.classList.remove('show');
      },
    );
  }

  const selectedCountryData = iti.getSelectedCountryData();
  const countryCode = selectedCountryData.iso2;
  const dialCode = selectedCountryData.dialCode;

  if (!dialCode) {
    isFormValid = false;
    callbackWithCleanup(
      () => {
        phoneInputErrorEl.innerText = 'Please select a country code';
        phoneInputErrorEl.classList.add('show');
      },
      () => {
        phoneInputErrorEl.innerText = 'error';
        phoneInputErrorEl.classList.remove('show');
      },
    );
  }

  if (!isFormValid) return;
  
  const params = new URLSearchParams({
    email,
    phone,
    countryCode,
    dialCode,
  }).toString();
  const thankYouPageUrl = `./thank-you.html?${params}`; 

  window.location.href = thankYouPageUrl;
};

form.addEventListener('submit', handleFormSubmit);
phoneInputEl.addEventListener('keypress', (event) => {
  if (isNaN(event.key)) event.preventDefault();
});
