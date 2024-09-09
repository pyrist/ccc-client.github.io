



  function log() {
    var line = Array.prototype.slice.call(arguments).map(function(argument) {
      return typeof argument === 'string' ? argument : JSON.stringify(argument);
    }).join(' ');
    document.querySelector('#log').textContent += line + '\n';
  }

async function bleConnect() {

  
    try {
      log('Requesting Bluetooth Device...');
      const device = await navigator.bluetooth.requestDevice({
          filters: [{name: "VH4110"}], "optionalServices": ["EF680100-1234-1234-1234-000000000000".toLowerCase()]});
  
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
      log('Argh! ' + error);
    }
  }
  
  async function onStopButtonClick() {
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