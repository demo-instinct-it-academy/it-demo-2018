export default class Router{
  constructor(routes){
    this._state = {};
    this._routes = routes;
  }
  listen(){
    window.onhashchange = () => {this.navigate()};
  }
  render(hash){
    console.log('ROUTE:', this._routes(hash));
    // window.location.hash
  }
  navigate(){
    let hash = window.location.hash;
    let state = decodeURIComponent(hash.substr(1));
    console.log(state);
    this.render(hash);
  }
}