from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import pyautogui

app = Flask(__name__)
CORS(app)

@app.route('/recorded_data', methods=['POST'])
def receive_recorded_data():
    recorded_data = request.json['data']
    python_script = generate_python_script(recorded_data)
    return jsonify({'python_script': python_script})

def generate_python_script(recorded_data):
    python_script = 'import pyautogui\n\n'  # Import statements
    for data in recorded_data:
        x = data['x']
        y = data['y']
        duration = data['duration'] / 1000  # Convert to seconds
        python_script += f"pyautogui.moveTo({x}, {y}, duration={duration})\n"
    return python_script

if __name__ == '__main__':
    app.run(debug=True)
