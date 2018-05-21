export default function routes(hash){
  switch (hash) {
    case '':
      return 'mainpage';
      break;
    case '#user':
      return 'user';
      break;
    case '#main':
      return 'mainpage';
      break;
    case '#table':
      return 'table';
      break;
    default:
      return hash.substr(1).split('/');
      break;
  }
}