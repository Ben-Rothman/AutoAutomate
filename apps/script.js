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
                recordedData.push({ x: event.clientX, y: event.clientY });
                lastTimestamp = timestamp;
            }
        }
    });

    function generatePythonScript(data) {
        let pythonScript = 'import time\nimport pyautogui\n\n'; // Import statements
        for (let i = 0; i < data.length; i++) {
            const { x, y } = data[i];
            pythonScript += `pyautogui.moveTo(${x}, ${y}, duration=0.05)\n`;
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
