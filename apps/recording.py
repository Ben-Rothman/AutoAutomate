from flask import Flask, request, jsonify
import pyautogui
from pynput.mouse import Listener as MouseListener
from pynput.keyboard import Listener as KeyboardListener
import threading

app = Flask(__name__)
recording_data = []

def on_mouse_move(x, y, dx, dy):
    recording_data.append((x, y, "mousemove"))

def on_click(x, y, button, pressed):
    action = "mousedown" if pressed else "mouseup"
    recording_data.append((x, y, action))

def on_scroll(x, y, dx, dy):
    recording_data.append((x, y, f"scroll({dx},{dy})"))

def on_press(key):
    try:
        recording_data.append((key.char, "keypress"))
    except AttributeError:
        recording_data.append((str(key), "keypress"))

def start_recording():
    with MouseListener(on_move=on_mouse_move, on_click=on_click, on_scroll=on_scroll) as mouse_listener:
        with KeyboardListener(on_press=on_press) as keyboard_listener:
            mouse_listener.join()
            keyboard_listener.join()

@app.route('/start_recording', methods=['POST'])
def start_recording_endpoint():
    recording_data.clear()
    threading.Thread(target=start_recording).start()
    return jsonify({'message': 'Recording started'})

@app.route('/stop_recording', methods=['POST'])
def stop_recording_endpoint():
    # Stop recording and return the recording data
    # You may need to handle stopping the listeners properly
    return jsonify({'data': recording_data})

if __name__ == '__main__':
    app.run()
