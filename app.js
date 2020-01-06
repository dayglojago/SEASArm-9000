"strict"
let app = {};

app.SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
app.CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

document.addEventListener('deviceready', function(){
    app.initialize();
});

app.initialize = function(){
    console.log('Initialized');
    app.connnected = false;
    app.device = null;
}

app.connect = function(){
    console.log("Attempting to connect");
    evothings.easyble.startScan(scanSuccess, scanFailure );
}

function scanSuccess(device){
    if(device.name != null){
        console.log("Found Team 3 BLE module " + device.name + " with device address " + device.address);
        if(device.name != null && device.address == '752A0106-EB94-0261-5779-3B3FBEC671A7'){
            device.connect(connectSuccess, connectFailure);
            evothings.easyble.stopScan();
        }
    }
}

function scanFailure(errorCode){
    console.log("Could not locate bluetooth device: " + errorCode);
}

function connectSuccess(device){
    console.log("Successfully connected to BLE module " + device.name + " with device address " + device.address);
    app.connected = true;
    app.device = device;
    app.device.readServices(serviceSuccess, serviceFailure, [app.SERVICE_UUID]);
}

function connectFailure(){
    console.log("Failed to connect to " + device.name);
    app.connected = false;
}

app.disconnect = function(errorMessage){
    if(errorMessage){
        console.log(errorMessage);
    }
    app.connected = false;
    app.device = null;

    evothings.easyble.stopScan();
    evothings.easyble.closeConnectedDevices();
    console.log("Successfully disconnected from device.");
}

function serviceSuccess(device){
    console.log("The Bluetooth Module can now read and write data at your whim.");
    app.device.enableNotification(app.SERVICE_UUID, app.CHARACTERISTIC_UUID,
        app.recieveData
        //navigator.notification.alert("We sent some data. Yay!", function(){}, "Alert", "Gotcha");
        ,
        function(errorCode){
            console.log("Failed to read from device: " + errorCode);
        }
    );
}

function serviceFailure(errorCode){
    console.log("Error. Failed to read services: " + errorCode);
    app.disconnect();
}

app.sendData = function(data){
    if(app.connected && app.device != null){
        data = new Uint8Array(data);
        app.device.writeCharacteristic(
            app.CHARACTERISTIC_UUID,
            data,
            function(){
                console.log("Message send
                ing succeeded. Data sent:" + data);
            },
            function(errorCode){
                console.log("Message sending failed: " + errorCode);
            },
            { writeConfigDescriptor: false },
        );
    }
    else{
        app.disconnect("Device was disconnected when trying to send message.");

    }
}

app.receiveData = function(data){
    console("Recieved Data " + data);
}

//WEBGL CODE BELOW

function main() {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");
  
    // Only continue if WebGL is available and working
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }
  
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  
  window.onload = main;