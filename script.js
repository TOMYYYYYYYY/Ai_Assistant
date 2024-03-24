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

  
    // OLD but working flask code (backup)
    /*
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    html = f"<h1>Deployed with Zeet!!</h1>"
    return html
     
@app.route('/receive', methods=['POST'])
def receive_message():
    data = request.get_json()
    message = data.get('message')
    id = data.get('id')
    # Process the message
    # Example: print the message and send a response back
    if message == 'Hello, server!':
        response_data = {'status': 'What is love?', 'id' : id}
    else:
        response_data = {'status': 'Message received' ,'id' : id}
    return jsonify(response_data), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3000)
    */
























// New code for chatbot -------------------------------------------------------------------------





















/*
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import shelve
#from dotenv import load_dotenv
import os
import time

app = Flask(__name__)
CORS(app)

OPEN_AI_API_KEY = "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"
client = OpenAI(api_key=OPEN_AI_API_KEY)


# --------------------------------------------------------------
# Thread management
# --------------------------------------------------------------
my_list = [] # List of id
list_of_threads = [] # List of threads

def check_if_thread_exists(wa_id):
    for i in range(len(my_list)):
        if my_list[i].wa_id == wa_id:
            return list_of_threads[i]
    return None

# ----------- else return none ----------------

# --------------------------------------------------------------
# Generate response
# --------------------------------------------------------------
def generate_response(message_body, wa_id, name):
    # Check if there is already a thread_id for the wa_id
    thread_id = check_if_thread_exists(wa_id)

    # If a thread doesn't exist, create one and store it
    if thread_id is None:
        print(f"Creating new thread for {name} with wa_id {wa_id}")
        thread = client.beta.threads.create()
        list_of_threads.append(thread)
        my_list.append(wa_id)

    # Otherwise, retrieve the existing thread
    else:
        print(f"Retrieving existing thread for {name} with wa_id {wa_id}")
        thread = client.beta.threads.retrieve(thread_id)

    # Add message to thread
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        #thread_id= thread.id ???
        role="user",
        content=message_body,
    )

    # Run the assistant and get the new message
    new_message = run_assistant(thread)
    print(f"To {name}:", new_message)
    return new_message

# --------------------------------------------------------------
# Run assistant
# --------------------------------------------------------------
def run_assistant(thread):
    # Retrieve the Assistant
    assistant = client.beta.assistants.retrieve("asst_7CdKruEYCfjtI3zIatVj6wGT")

    # Run the assistant
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant.id,
    )

    # Wait for completion
    while run.status != "completed":
        # Be nice to the API
        time.sleep(0.5)
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

    # Retrieve the Messages
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    new_message = messages.data[0].content[0].text.value
    print(f"Generated message: {new_message}")
    return new_message

@app.route('/')
def hello_world():
    html = f"<h1>Deployed with Zeet!!</h1>"
    return html
     
@app.route('/receive', methods=['POST'])
def receive_message():
    data = request.get_json()
    message = data.get('message')
    id = data.get('id')

    response_data = generate_response(message, id, "John")
    return jsonify(response_data), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3000)



#load_dotenv()










# --------------------------------------------------------------
# Test assistant
# --------------------------------------------------------------



new_message = generate_response("What was my previous question?", "12345", "John")




*/