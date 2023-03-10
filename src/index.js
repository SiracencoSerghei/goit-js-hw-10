import './css/styles.css';
import {fetchCountries} from './modules/fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

let searchCountry = '';

function handleSearch() {
  searchCountry = searchBox.value.trim();

  if (searchCountry === '') {
    clearResults();
    return;
  }

  fetchCountries(searchCountry).then(handleCountries).catch(handleError);
};


function handleCountries(countries) {
  if (countries.length < 2) {
    console.log(countries);
    createCountryInfoCard(countries);
    Notify.success('Here is your Info Card');
  } else if (countries.length >= 2 && countries.length <= 10) {
     console.log(countries);
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
      c => `<li class="country-list--item">
            <img src="${c.flags.svg}" alt="Country flag" width="40", height="30">
            <span class="country-list--name">${c.name.official}</span>
        </li>`
    )
    .join('');
  countryList.insertAdjacentHTML('beforeend', readyList);
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
