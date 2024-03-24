var running = false;
let userId = Math.floor(Math.random() * 999999999) + 1;
console.log(userId);

var buttons = document.getElementsByClassName("sugestion2");
  
//const words = document.querySelectorAll('.sugestion2');

//words[0].button.textContent = 'YourWordHere';


var thebutton = true; // This is just an example condition
for (let i = 0; i < buttons.length; i++) {
  if (thebutton) {
    buttons[i].style.display = "none"; // This will hide the button
  } else {
    buttons[i].style.display = "block"; // This will show the button
  }
}

function hide() {
  if(first == true)
  {
    var suggestion = ["bonjour", "bonsoir", "salut"];
  buttons[0].textContent = suggestion[0];
  console.log(suggestion[0]);
  buttons[1].textContent = suggestion[1];
  buttons[2].textContent = suggestion[2];
  thebutton = !thebutton;
  for (let i = 0; i < buttons.length; i++) {
    if (thebutton) {
      buttons[i].style.display = "none"; // This will hide the button
    } else {
      buttons[i].style.display = "block"; // This will show the button
    }
  }
  }
  
  
}
function sendSugestion(msg) {
  if (running == true) return;
  running = true;
  addMsg(msg);
  sendMsgToServer(msg, userId);
}


function send() {
  if (running == true) return;
  var msg = document.getElementById("message").value;
  if (msg == "") return;
  running = true;
  
  addMsg(msg);
  //addResponseMsg("Thinking...");
  sendMsgToServer(msg,userId);
  //DELEAY MESSAGE RESPOSE Echo
  window.setTimeout(addResponseMsg, 500, "(Thinking...)");
}
//change the func to add userId
function sendMsgToServer(message, userId) { 
  fetch('https://lhfzvc3tod.execute-api.us-west-2.amazonaws.com/receive', {
    method: 'POST',
    body: JSON.stringify({ message: message, id: userId }),
    // id = data.get('id') --- in flask
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    
  })
    .then(response => response.json())
    .then(data => {
      const messageFromServer = data.status; 
      console.log('Response from server:', messageFromServer);
      addResponseMsg(messageFromServer);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
function addMsg(msg) {
  var div = document.createElement("div");
  div.innerHTML =
    "<span style='flex-grow:1'></span><div class='chat-message-sent'>" +
    msg +
    "</div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  //SEND MESSAGE TO API
  document.getElementById("message").value = "";
  document.getElementById("message-box").scrollTop = document.getElementById(
    "message-box"
  ).scrollHeight;
}
function addResponseMsg(msg) {
  var div = document.createElement("div");
  div.innerHTML = "<div class='chat-message-received'>" + msg + "</div>";
  div.className = "chat-message-div";
  document.getElementById("message-box").appendChild(div);
  document.getElementById("message-box").scrollTop = document.getElementById(
    "message-box"
  ).scrollHeight;
  running = false;
}
document.getElementById("message").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    send();
  }
  
});

 document.getElementById("chatbot_toggle").onclick = function () {
    if (document.getElementById("chatbot").classList.contains("collapsed")) {
      document.getElementById("chatbot").classList.remove("collapsed");
      document.getElementById("chatbot_toggle").children[0].style.display = "none";
      document.getElementById("chatbot_toggle").children[1].style.display = "";
      setTimeout(addResponseMsg,1000,"Hi")
      hide();
    }
    else {
      document.getElementById("chatbot").classList.add("collapsed");
      document.getElementById("chatbot_toggle").children[0].style.display = "";
      document.getElementById("chatbot_toggle").children[1].style.display = "none";
      hide();
    }
  }

