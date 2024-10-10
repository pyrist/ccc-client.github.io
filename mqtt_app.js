function startConnect() {
    clientID = "clientID - " + parseInt(Math.random() * 100);

    host = "test.mosquitto.org";
    port = 8081;


    client = new Paho.MQTT.Client("wss://test.mosquitto.org:8081/", clientID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({
        onSuccess: onConnect
        //        userName: userId,
        //       passwordId: passwordId
    });
}


function onConnect() {
    log("Connected to " + host + ":" + port)
    topic = "10092024/4110/general_status"
    log("Subscribing to " + topic)
    client.subscribe(topic);
    topic = "10092024/4110/location"
    log("Subscribing to " + topic)
    client.subscribe(topic);
}


function onConnectionLost(responseObject) {
    log("Connection is lost");
    if (responseObject != 0) {
        log("ERROR:" + responseObject.errorMessage);
    }
    startConnect();
}


function startDisconnect() {
    client.disconnect();
}


function onMessageArrived(message) {
    log("OnMessageArrived: " + message.destinationName + " " + message.payloadString);
    obj = JSON.parse(message.payloadString);
    if (message.destinationName == "10092024/4110/general_status") {
        document.querySelector('#state').textContent = obj.status;
        document.querySelector('#state').style.color = "var(--vector-red)";
        document.querySelector('#locked').textContent = obj.locked;
        document.querySelector('#locked').style.color = "var(--vector-red)";
        document.querySelector('#battery').textContent = obj.battery;
        document.querySelector('#battery').style.color = "var(--vector-red)";
        document.querySelector('#fuel').textContent = obj.fuel;
        document.querySelector('#fuel').style.color = "var(--vector-red)";
        document.querySelector('#temperature').textContent = obj.temperature;
        document.querySelector('#temperature').style.color = "var(--vector-red)";
        setTimeout(function () {
            document.querySelector('#state').style.color = "var(--vector--darker-grey)";
            document.querySelector('#locked').style.color = "var(--vector--darker-grey)";
            document.querySelector('#battery').style.color = "var(--vector--darker-grey)";
            document.querySelector('#fuel').style.color = "var(--vector--darker-grey)";
            document.querySelector('#temperature').style.color = "var(--vector--darker-grey)";
        }, 2000);
    }
    else if (message.destinationName == "10092024/4110/location") {
        //
    }
    else {
        log("Unknown message");
    }

}


function publishMessage(msg) {
    Message = new Paho.MQTT.Message(msg);
    Message.destinationName = "10092024/4110/location";

    client.send(Message);
}

startConnect()