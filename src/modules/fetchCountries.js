import { Notify } from "notiflix";

const BASE_URL = 'https://restcountries.com/v3.1/name/';
const PARAMS = 'name,capital,population,flags,languages';

function fetchCountries(name)  {
  return fetch(`${BASE_URL}/${name}?fields=${PARAMS}`).then(response => {
    if (response.ok) {
      return response.json();
    }
    Notify.failure('Oops, there is no country with that name.');
    throw new Error(response.statusText);
    
  });
}
export { fetchCountries };

