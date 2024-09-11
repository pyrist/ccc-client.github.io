


var toggleCarState;


function toggleCar()
{
    if (toggleCarState)
    {
      document.querySelector('#toggleOn').style.opacity = 1.0
      document.querySelector('#toggleOff').style.opacity = 0.0

    }
    else
    {
      document.querySelector('#toggleOn').style.opacity = 0.0
      document.querySelector('#toggleOff').style.opacity = 1.0

    }

    toggleCarState = toggleCarState++ ^ 1;
    toggleCarTimer = setTimeout(toggleCar, 1000);

}

var device;
var server;
var myCharacteristic;
var toggleCarTimer

async function bleConnect() {

    toggleCarState = 0;
    toggleCarTimer = setTimeout(toggleCar, 1000);
  
    try {
      devices = await navigator.bluetooth.getDevices();
      device = null;
      for (x of devices)
      {
         log(x.name)
         console.log(x)
         if (x.name == "vector-vh4110" || x.name == "VH4110")
         {
          device = x
         }
      }
      if (device == null)
      {
        log('Requesting Bluetooth Device...');
        device = await navigator.bluetooth.requestDevice({
                    filters: [{services: [0xff05]}],
                    optionalServices: ["EF680100-1234-1234-1234-000000000000".toLowerCase()]})

      }
      log('Connecting to GATT Server...');
      server = await device.gatt.connect();
  
      log('Getting Service...');
      service = await server.getPrimaryService("EF680100-1234-1234-1234-000000000000".toLowerCase());
  
      log('Getting Characteristic...');
      myCharacteristic = await service.getCharacteristic("EF680101-1234-1234-1234-000000000000".toLowerCase());
  
      await myCharacteristic.startNotifications();
  
      log('> Notifications started');
      myCharacteristic.addEventListener('characteristicvaluechanged',
          handleNotifications);
    } catch (error) {
      console.log(error)
      log(error);
    }
  }
  
  async function bleDisconnect() {

    clearTimeout(toggleCarTimer);
    document.querySelector('#toggleOn').src = "car-grey-closed.png"
    document.querySelector('#toggleOff').src = "car-off-closed.png"
    document.querySelector('#toggleOn').style.opacity = 1.0
    document.querySelector('#toggleOff').style.opacity = 0.0

    if (myCharacteristic) {
      try {
        await myCharacteristic.stopNotifications();
        log('> Notifications stopped');
        myCharacteristic.removeEventListener('characteristicvaluechanged',
            handleNotifications);
      } catch(error) {
        log('Argh! ' + error);
      }
    }
    if (device)
      {
        device.gatt.disconnect();
        log("Device disconnected")
      }
  }
  
  function handleNotifications(event) {
    
    let value = event.target.value.getInt8(0);
    console.log(value)

    if (value > -45)
    {
      document.querySelector('#toggleOn').src = "car-green-open.png"
      document.querySelector('#toggleOff').src = "car-grey-closed.png"

    }
    else if (value > -55)
    {
      document.querySelector('#toggleOn').src = "car-orange-closed.png"
      document.querySelector('#toggleOff').src = "car-grey-closed.png"
    }
    else if (value > -95)
    {
      document.querySelector('#toggleOn').src = "car-red-closed.png"
      document.querySelector('#toggleOff').src = "car-off-closed.png"
    }
    else
    {
      document.querySelector('#toggleOn').src = "car-grey-closed.png"
      document.querySelector('#toggleOff').src = "car-off-closed.png"
    }
  }