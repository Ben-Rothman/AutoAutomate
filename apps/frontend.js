document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startRecording');
    const stopButton = document.getElementById('stopRecording');
    const downloadPythonButton = document.getElementById('downloadPython');
    
    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    downloadPythonButton.addEventListener('click', downloadPythonFile);
});

function startRecording() {
    fetch('/start_recording', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => console.log(data.message)) // Display a success message
    .catch(error => console.error('Error starting recording:', error));
}

function stopRecording() {
    fetch('/stop_recording', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        // Process the recorded data, which is available in data.data
        console.log('Recorded data:', data.data);
    })
    .catch(error => console.error('Error stopping recording:', error));
}

function downloadPythonFile() {
    fetch('/stop_recording', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        const pythonCode = generatePythonCode(data.data); // Call a function to generate Python code
        downloadFile('recorded.py', pythonCode); // Call a function to initiate the download
    })
    .catch(error => console.error('Error stopping recording:', error));
}

function generatePythonCode(recordedData) {
    let pythonCode = '';
    for (const action of recordedData) {
        const [x, y, eventType] = action;
        switch (eventType) {
            case 'mousemove':
                pythonCode += `pyautogui.moveTo(${x}, ${y})\n`;
                break;
            case 'mousedown':
                pythonCode += `pyautogui.mouseDown(${x}, ${y})\n`;
                break;
            case 'mouseup':
                pythonCode += `pyautogui.mouseUp(${x}, ${y})\n`;
                break;
            case 'scroll':
                const [dx, dy] = action.slice(2);
                pythonCode += `pyautogui.scroll(${dx}, ${dy})\n`;
                break;
            case 'keypress':
                const key = action[0];
                pythonCode += `pyautogui.press('${key}')\n`;
                break;
            // Handle other cases as needed
        }
    }
    return pythonCode;
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}
