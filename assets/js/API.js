const http = new XMLHttpRequest();
const url='https://api.plenusbot.xyz/numbers';
http.open("GET", url);
http.send();

http.onreadystatechange = (e) => {
  console.log('done')
}