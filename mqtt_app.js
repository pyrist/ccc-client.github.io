function log() {
    var line = Array.prototype.slice.call(arguments).map(function(argument) {
      return typeof argument === 'string' ? argument : JSON.stringify(argument);
    }).join(' ');
    obj = document.querySelector('#log')
    log.textContent += line + '\n';
    obj.scrollTop = objDiv.scrollHeight;
  }

function startConnect()
{

    clientID = "clientID - "+parseInt(Math.random() * 100);

    host = "test.mosquitto.org";   
    port = 8081;  
  

  //  client = new Paho.MQTT.Client("wss://test.mosquitto.org:8081/",clientID);
    client = new Paho.MQTT.Client("wss://mqtt.eclipseprojects.io:443/mqtt",clientID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({
        onSuccess: onConnect
//        userName: userId,
 //       passwordId: passwordId
    });


}


function onConnect(){
    log("Connected to " + host + ":" + port)
//    topic = "10092024/4110/general_status"
    topic = "#"

    log("Subscribing to " + topic)
    client.subscribe(topic);
}



function onConnectionLost(responseObject){
    log("<span> ERROR: Connection is lost.</span><br>");
    if(responseObject !=0){
        log("ERROR:"+ responseObject.errorMessage);
    }
}



function startDisconnect(){
    client.disconnect();
}

function onMessageArrived(message){
    log("OnMessageArrived: "+message.payloadString);
}

function publishMessage(){
    msg = "abc123";

    Message = new Paho.MQTT.Message(msg);
    Message.destinationName = "blub";

    client.send(Message);


}

startConnect()