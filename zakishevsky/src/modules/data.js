export default class CryptoCurrency{
  constructor(currency){
    Object.assign(this, currency);
  }

}

// const myApi = 'https://api.coinmarketcap.com/v1/ticker/';
// let ticker = [];
// let thead = []
// let coinmarketcapAPI;

// fetch(myApi)
//   .then(res => res.json())
//   .then(arr => makeTable(arr))
//   .then(table => document.body.appendChild(table))
//   .then(() => console.log('after table:', coinmarketcapAPI))
//   .catch(error => console.error('Some problem:', error));
  

// function makeTable(data){
//   coinmarketcapAPI = data;
//   let tableContainer = document.createElement('table');
//       tableContainer.className = 'tableContainer';
//       tableContainer.appendChild(makeTableHeader(thead));
//       tableContainer.appendChild(makeTableData(data));
//   return tableContainer;  
// }

// function makeTableHeader(heads){
//   let thead = document.createElement('thead');
//   let tr = document.createElement('tr');
//   let trIcon = document.createElement('td');
//       trIcon.textContent = 'icon';
//       tr.appendChild(trIcon);
//   heads.map((key)=>{
//     let th = document.createElement('th');
//         th.textContent = key;
//         tr.appendChild(th);
//   });
//   thead.appendChild(tr);
//   return thead;
// }

// function makeTableData(data){
//   let tbody = document.createElement('tbody');
  
//   data.map((obj) =>{
//     let row = document.createElement('tr');
//     let trIconImg = document.createElement('img');
//         trIconImg.src = `assets/icons/${obj.symbol}.svg`; 
//         row.appendChild(trIconImg);
//     Object.keys(obj).map((key) => {
//       let td = document.createElement('td');
//             td.textContent = obj[key];
//         row.appendChild(td); 
//     });
//     tbody.appendChild(row);
//   });
//   return tbody;
// }


// d3.select("body")
//   .selectAll("div")
//   .data([4,5,8,1,2,6,8,9,12,353])
//   .enter()
//   .append("div")
//   .classed("chart", true)
//   .style("width", function(d) { return d * 2 + "px"; })
//   .text(function(d) { return d; });
  


// const ajaxStorageUrl = "http://fe.it-academy.by/AjaxStringStorage2.php",
//       storageName = 'HH_COINS_TRY';

// const insertHH = {
//   f: 'INSERT', 
//   n: storageName, 
//   v: JSON.stringify(coinmarketcapAPI)
// }

// const readHH = {
//   f: 'READ', 
//   n: storageName, 
// }

// const requestHeaders = {"content-type" : "application/x-www-form-urlencoded; charset=UTF-8"};
// let insertRequest =  new Request(ajaxStorageUrl, {
//   method: 'POST', 
//   headers: requestHeaders,
//   body: queryParams(insertHH)
// });
// let readRequest =  new Request(ajaxStorageUrl, {
//   method: 'POST', 
//   headers: requestHeaders,
//   body: queryParams(readHH)
// });

// function queryParams(params) {
//   return Object.keys(params)
//       .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
//       .join('&');
// }

// function getData(opts) {
//   return fetch(opts)
//     .then(response => response.json())
//     .then(json => console.log('GetData success:', json.result))
//     .catch(onError)
// }

// function postData(opts) {
//   return fetch(opts)
//   .then(response => response.json())
//   .then(json => console.log('PostData Success:', json))
//   .catch(onError)
// }

// function onError(e){
//   console.log('houston we have a problem:', e);
// }

// // postData(insertRequest);
// // getData(readRequest);

// // whattomine
// // bitfinex
// // bitinfocharts.com


// function cons(x){
//   console.log(x);
// }


// [1,2,3,4,5].map(x => console.log(x));

