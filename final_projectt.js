// DOM Elements
const connStatus = document.getElementById('connStatus');
const btnMotor = document.getElementById('btnMotor');
const btnFan = document.getElementById('btnFan');
const motorInd = document.getElementById('motorIndicator');
const fanInd = document.getElementById('fanIndicator');

// ADC Displays
const valTemp = document.getElementById('valTemp');
const valVolt = document.getElementById('valVolt');
const valCurr = document.getElementById('valCurr');
const valVib = document.getElementById('valVib');

// PSW Indicators
const pswInds = [
    document.getElementById('psw0'),
    document.getElementById('psw1'),
    document.getElementById('psw2'),
    document.getElementById('psw3')
];

let ws = null;
const WS_URL = 'ws://127.0.0.1:3000/ecclab';

function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        connStatus.textContent = 'System Online';
        connStatus.className = 'status-badge connected';
        btnMotor.disabled = false;
        btnFan.disabled = false;
        
        // Reset LEDs on connection
        ws.send('led,0,0');
        ws.send('led,1,0');
    };

    ws.onmessage = (event) => {
        const msg = event.data;
        const parts = msg.replace('ok: ', '').split(',');
        const type = parts[0];

        if (type === 'adc') {
            handleADC(parts[1], parts[2]);
        } else if (type === 'led') {
            handleLED(parts[1], parts[parts.length - 1]);
        } else if (type === 'psw') {
            handlePSW(parts[1], parts[2]); // parts[2] is the state (0 or 1)
        }
    };

    ws.onclose = () => {
        connStatus.textContent = 'Connection Lost';
        connStatus.className = 'status-badge disconnected';
        btnMotor.disabled = true;
        btnFan.disabled = true;
        setTimeout(connect, 2000);
    };
}

// --- Parsers ---

function handleADC(id, rawValue) {
    const raw = parseInt(rawValue);
    
    // Scale the raw 0-1023 value into realistic engineering units
    if (id === '0') {
        // Temperature: 20C to 90C
        valTemp.textContent = (20 + (raw / 1023) * 70).toFixed(1);
    } else if (id === '1') {
        // Voltage: 220V to 240V
        valVolt.textContent = (220 + (raw / 1023) * 20).toFixed(1);
    } else if (id === '2') {
        // Current: 0A to 15A
        valCurr.textContent = ((raw / 1023) * 15).toFixed(2);
    } else if (id === '3') {
        // Vibration: 0Hz to 60Hz
        valVib.textContent = ((raw / 1023) * 60).toFixed(1);
    }
}

function handleLED(id, state) {
    const isOn = state === '1';
    
    if (id === '0') {
        motorInd.className = isOn ? 'indicator active' : 'indicator';
        btnMotor.textContent = isOn ? 'STOP MOTOR' : 'START MOTOR';
        btnMotor.className = isOn ? 'btn-stop' : 'btn-primary';
    } else if (id === '1') {
        fanInd.className = isOn ? 'indicator active' : 'indicator';
        btnFan.textContent = isOn ? 'STOP FAN' : 'START FAN';
        btnFan.className = isOn ? 'btn-stop' : 'btn-secondary';
    }
}

function handlePSW(id, state) {
    const idx = parseInt(id);
    if (pswInds[idx]) {
        pswInds[idx].className = state === '1' ? 'hw-indicator pressed' : 'hw-indicator';
    }
}

// --- Interactions ---

btnMotor.addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send('led,0,2'); // Toggle LED 0
});

btnFan.addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send('led,1,2'); // Toggle LED 1
});

// Start application
connect();