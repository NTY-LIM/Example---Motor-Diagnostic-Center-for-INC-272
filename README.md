# Advanced Motor Diagnostic Center

## Project Goal
A comprehensive, browser-based Human-Machine Interface (HMI) designed to monitor the health of an industrial synchronous motor and provide remote operational control.

## Project Scope
This project implements an advanced diagnostic dashboard. It connects to the course's Node.js mock hardware server via WebSockets, demonstrating a full control loop utilizing both discrete (switch/LED) and analog (ADC) signals across multiple channels simultaneously.

## Features Included
- **Control Elements:** Toggle buttons for the Main Motor (`led,0`) and Cooling Fan (`led,1`), providing visual state feedback.
- **Monitoring Elements (Telemetry):** Continuous polling of four ADC channels scaled into realistic engineering units:
  - ADC 0: Operating Temperature
  - ADC 1: System Voltage
  - ADC 2: Current Draw
  - ADC 3: Motor Vibration
- **Hardware Status:** Real-time physical switch monitoring, displaying the depressed/released state of PSW channels 0 through 3.
- **Library Integration:** Utilizes the provided `ecc-core` and `ecc-web-gui` libraries for underlying structure.

## File Structure
- `index.html`: The structural layout of the dashboard, utilizing CSS Grid.
- `style.css`: Custom styling for the diagnostic center, ensuring a responsive and professional industrial interface.
- `main.js`: Contains the WebSocket lifecycle logic, multi-channel data parsing, scaling functions, and DOM manipulation.
- `ecc-core.css`, `ecc-core.js`, `ecc-web-gui.css`, `ecc-web-gui.js`, `favicon.ico`: Course-provided system libraries.
- `README.md`: Project documentation and scope definition.

## Setup and Usage
1. Open a terminal and start the mock hardware server (`npm install` then `npm start`). Ensure it is running on `ws://127.0.0.1:3000/ecclab`.
2. Open `index.html` in a modern web browser.
3. Verify the Connection Status badge reads "System Online" in green.
4. Interact with the "START MOTOR" and "START FAN" buttons to test the control loop.
5. Observe the live telemetry values and hardware switch indicators updating dynamically based on the server's automated broadcasts.
