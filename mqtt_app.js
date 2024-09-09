function startConnect(){

    clientID = "clientID - "+parseInt(Math.random() * 100);

    host = document.getElementById("host").value;   
    port = document.getElementById("port").value;  
  


    client = new Paho.MQTT.Client(host,Number(port),clientID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({
        onSuccess: onConnect
//        userName: userId,
 //       passwordId: passwordId
    });


}


function onConnect(){
    topic =  "#";
    client.subscribe(topic);
}



function onConnectionLost(responseObject){
    document.getElementById("messages").innerHTML += "<span> ERROR: Connection is lost.</span><br>";
    if(responseObject !=0){
        document.getElementById("messages").innerHTML += "<span> ERROR:"+ responseObject.errorMessage +"</span><br>";
    }
}



function startDisconnect(){
    client.disconnect();
}

function onMessageArrived(message){
    console.log("OnMessageArrived: "+message.payloadString);
}

function publishMessage(){
msg = "abc123";

Message = new Paho.MQTT.Message(msg);
Message.destinationName = "blub";

client.send(Message);


}