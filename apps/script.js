document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startRecording');
    const stopButton = document.getElementById('stopRecording');
    const generateScriptButton = document.getElementById('generateScript');

    const recordedData = [];
    let isRecording = false;

    startButton.addEventListener('click', () => {
        recordedData.length = 0;
        isRecording = true;
        console.log('Recording started');
    });

    stopButton.addEventListener('click', () => {
        isRecording = false;
        console.log('Recording stopped');
    });

    generateScriptButton.addEventListener('click', () => {
        const pythonScript = generatePythonScript(recordedData);
        console.log('Generated Python script:\n', pythonScript);
        downloadFile('generated_script.py', pythonScript); // Download the script
    });

    let lastTimestamp = 0;
    document.addEventListener('mousemove', (event) => {
        if (isRecording) {
            const timestamp = performance.now();
            if (timestamp - lastTimestamp >= 50) { // Record every 10th of a second (100ms)
                recordedData.push({ type: 'mousemove', x: event.clientX, y: event.clientY });
                lastTimestamp = timestamp;
            }
        }
    });

    document.addEventListener('mousedown', (event) => {
        if (isRecording) {
            recordedData.push({ type: 'mousedown', x: event.clientX, y: event.clientY });
        }
    });

    document.addEventListener('mouseup', (event) => {
        if (isRecording) {
            recordedData.push({ type: 'mouseup', x: event.clientX, y: event.clientY });
        }
    });

    function generatePythonScript(data) {
        let pythonScript = 'import time\nimport pyautogui\n\n'; // Import statements
        for (let i = 0; i < data.length; i++) {
            const { type, x, y } = data[i];
            if (type === 'mousemove') {
                pythonScript += `pyautogui.moveTo(${x}, ${y}, duration=0.05)\n`;
            } else if (type === 'mousedown') {
                pythonScript += `pyautogui.mouseDown(${x}, ${y}, button='left')\n`;
            } else if (type === 'mouseup') {
                pythonScript += `pyautogui.mouseUp(${x}, ${y}, button='left')\n`;
            }
        }
        return pythonScript;
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
        document.body.removeChild(a);
    }
});
