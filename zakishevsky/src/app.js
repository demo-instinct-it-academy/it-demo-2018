import * as d3 from 'd3';
import './assets/css/main.scss';
import test from './modules/test';

import routes from './modules/routes';
import Router from './modules/router';
import CryptoCurrency from './modules/data';

window.d3 = d3; // debug purpose;

const router = new Router(routes);
router.listen();


const myApi = 'https://api.coinmarketcap.com/v1/ticker/';
const data = [];
fetch(myApi)
  .then(res => res.json())
  .then(json => {
    let arrayOfCurrenciesObject = json.reduce((acc, curr) => {
      acc.push(new CryptoCurrency(curr));
      return acc;
    }, []);
    // let {name, symbol, price_usd, percent_change_24h, url = `https://${symbol}.com`} = json[0];//template literal example;
    // let currency = new CryptoCurrency(json[0]);
    console.table(arrayOfCurrenciesObject);
    return json
  })
  then(json => console.table(json[0].max_supply));