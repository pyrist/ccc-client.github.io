


  function log() {
    var line = Array.prototype.slice.call(arguments).map(function(argument) {
      return typeof argument === 'string' ? argument : JSON.stringify(argument);
    }).join(' ');
    document.querySelector('#log').textContent += line + '\n';
  }

async function bleConnect() {

  
    try {
      devices = await navigator.bluetooth.getDevices();
      device = null;
      for (x of devices)
      {
         log(x.name)
         console.log(x)
         if (x.name == "vector-vh4110")
         {
          device = x
          break;
         }
      }
      if (device == null)
      {
        log('Requesting Bluetooth Device...');
        device = await navigator.bluetooth.requestDevice({
                    filters: [{"services": ["EF680100-1234-1234-1234-000000000000".toLowerCase()]}]});
      }


      log('Connecting to GATT Server...');
      const server = await device.gatt.connect();
  
      log('Getting Service...');
      const service = await server.getPrimaryService("EF680100-1234-1234-1234-000000000000".toLowerCase());
  
      log('Getting Characteristic...');
      myCharacteristic = await service.getCharacteristic("EF680101-1234-1234-1234-000000000000".toLowerCase());
  
      await myCharacteristic.startNotifications();
  
      log('> Notifications started');
      myCharacteristic.addEventListener('characteristicvaluechanged',
          handleNotifications);
    } catch(error) {
      log(error);
    }
  }
  
  async function bleDisconnect() {

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
    let value = event.target.value;
    let a = [];
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    for (let i = 0; i < value.byteLength; i++) {
      a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
    }
    log('> ' + a.join(' '));
  }