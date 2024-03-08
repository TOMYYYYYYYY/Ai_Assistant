var running = false;

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



function send() {
  if (running == true) return;
  var msg = document.getElementById("message").value;
  if (msg == "") return;
  running = true;
  addMsg(msg);
  //DELEAY MESSAGE RESPOSE Echo
  window.setTimeout(addResponseMsg, 1000, msg);
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

  /* implémentation de l'api (plus tard)
  //envoyer des données au serveur
fetch('url_du_serveur', {
  method: 'POST',
  body: JSON.stringify({ userInput: userInputValue }),
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    // Faire quelque chose avec la réponse du serveur
  })
  .catch(error => {
    console.error('Erreur lors de l\'envoi des données au serveur', error);
  });

  // recuperer les données envoyées par js
  /*
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/endpoint', methods=['POST'])
def endpoint():
    data = request.json
    # Faire quelque chose avec les données reçues
    return jsonify({'message': 'Données reçues avec succès'})

if __name__ == '__main__':
    app.run()
  */