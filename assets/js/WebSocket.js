const socket = new WebSocket("wss://ws.plenusbot.xyz:8443");
let connected = false;

socket.onopen = () => {
  console.log("Connected to the Plenus Websocket");
  connected = true;
  socket.send(JSON.stringify({
    type: "numbers"
  }));
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.message === "RETURNED_NUMBERS") {
    const users = data.data.users;
    const servers = data.data.guilds;
    let users_counter = document.getElementById("users_counter");
    let servers_counter = document.getElementById("servers_counter");

    users_counter.textContent = users;
    servers_counter.textContent = servers;
  }
}

setInterval(() => {
  if (connected === true) socket.send(JSON.stringify({
    type: "numbers"
  }));
}, 1000);