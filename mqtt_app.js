
function startConnect()
{

    clientID = "clientID - "+parseInt(Math.random() * 100);

    host = "test.mosquitto.org";   
    port = 8081;  
  

    client = new Paho.MQTT.Client("wss://test.mosquitto.org:8081/",clientID);
    //client = new Paho.MQTT.Client("wss://mqtt.eclipseprojects.io:443/mqtt",clientID);

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
    topic = "10092024/4110/general_status"
    log("Subscribing to " + topic)
    client.subscribe(topic);
    topic = "10092024/4110/location"
    log("Subscribing to " + topic)
    client.subscribe(topic);
}



function onConnectionLost(responseObject){
    log("Connection is lost");
    if(responseObject !=0){
        log("ERROR:"+ responseObject.errorMessage);
    }
}



function startDisconnect(){
    client.disconnect();
}

function onMessageArrived(message){
    log("OnMessageArrived: " + message.destinationName + " " + message.payloadString);
    obj = JSON.parse(message.payloadString);
    if (message.destinationName == "10092024/4110/general_status")
    {
    }
    else if (message.destinationName == "10092024/4110/location")
    {
        map.setCenter(new OpenLayers.LonLat(obj.latidude, obj.longitude) // Center of the map
        .transform(
          new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
          new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
        ), 12 // Zoom level
      );

    }
    else
    {
        log("Unknown message");
    }
    
}

function publishMessage(msg){

    Message = new Paho.MQTT.Message(msg);
    Message.destinationName = "10092024/4110/location";

    client.send(Message);


}

startConnect()