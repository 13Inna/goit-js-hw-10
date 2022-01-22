import countryTpl from "./templates/country.hbs"
import countryListTpl from "./templates/flag_name.hbs"
import debounce from "lodash.debounce"
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputCountry = document.querySelector('[id = search-box]')
const countryInfo = document.querySelector('.country-info')
const countryList = document.querySelector('.country-list')

const onInputValue = (e) => {
    let nameCountry = ''
    nameCountry = e.target.value

    if (nameCountry === '') {
        onCleanSearch()
        return
    }

    fetch(`https://restcountries.com/v3.1/name/${nameCountry.trim()}?fields=name,capital,population,flags,languages`)
    .then(response => {
    return response.json()
    })
    .then(country => {
    if (country.length > 10){   
        Notify.info('Too many matches found. Please enter a more specific name.')
        onCleanSearch()
        return
    }
        
    if (country.length === 1) {
        onCleanSearch()
        const markup = countryTpl(country)
        countryInfo.innerHTML = markup
    return}
    if (country.status === 404) {
        onCleanSearch()
        Notify.failure('Oops, there is no country with that name.')
        return
    }
        onCleanSearch()
        const markup = country.map(countryListTpl).join('')
        countryList.innerHTML = markup
    }
    )
        .catch(error => { });
}  


function onCleanSearch() {
    countryInfo.innerHTML = ''
    countryList.innerHTML = ''
    }

 inputCountry.addEventListener('input', debounce(onInputValue, 500))