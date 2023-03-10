// --- imports
import './css/styles.css';
import { fetchCountries } from './modules/fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

// ----- references
const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

let searchCountry = '';

function handleSearch() {
  clearResults();
  searchCountry = searchBox.value.trim();
  if (searchCountry === '') {
    return;
  }
  fetchCountries(searchCountry).then(handleCountries).catch(handleError);
}

let countriesArray = [];

function handleCountries(countries) {
  if (countries.length < 2) {
    createCountryInfoCard(countries);
    Notify.success('Here is your Info Card');
  } else if (countries.length >= 2 && countries.length <= 10) {
    // console.log(countries);
    countriesArray = countries;
    // console.log(countriesArray);
    createCountryListItem(countries);
    Notify.success('Here is your Countries List');
  } else {
    clearResults();
    handleInfo();
  }
}
function handleError() {
  clearResults();
  Notify.failure('Oops, there is no country with that name.');
}

function handleInfo() {
  clearResults();
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function clearResults() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

const createCountryListItem = country => {
  clearResults();
  const readyList = country
    .map(
      c => `<li class="country-list--item"><button class="${c.name.common}" type="button">
            <img src="${c.flags.svg}" alt="Country flag" width="40", height="30">
            <span class="country-list--name">${c.name.official}</span></button>
        </li>`
    )
    .join('');

  const readyListNotation =
    '<h2 class="info-list">можна натиснути у списку</h2>';

  countryList.insertAdjacentHTML('afterbegin', readyListNotation);
  countryList.insertAdjacentHTML('beforeend', readyList);
  countryList.addEventListener('click', e => {
    if (e.target.nodeName !== 'BUTTON') {
      return;
    }
    // const countryName = e.target.classList.value;
    clearResults();
    // console.log(countryName);
    searchBox.value = '';
    // fetchCountries(countryName).then(handleCountries).catch(handleError);
    createCountryInfoCard(countriesArray);
  });
};

function createCountryInfoCard(country) {
  clearResults();
  const c = country[0];
  const readyCard = `<div class="country-card">
        <div class="country-card--header">
            <img src="${
              c.flags.svg
            }" alt="Country flag" width="155", height="135">
            <h2 class="country-card--name"> ${c.name.official}</h2>
        </div>
            <p class="country-card--field"><b>Capital:  <span class="country-value">${
              c.capital
            }</span></b></p>
            <p class="country-card--field"><b>Population:  <span class="country-value">${
              c.population
            }</span></b></p>
            <p class="country-card--field"><b>Languages:  <span class="country-value">${Object.values(
              c.languages
            ).join(',')}</span><b></p>
    </div>`;
  countryInfo.innerHTML = readyCard;
}
