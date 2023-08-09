from flask import Flask, request, jsonify
from pynput.mouse import Listener as MouseListener
from pynput.keyboard import Listener as KeyboardListener
import threading

app = Flask(__name__)
recording_data = []
mouse_listener = None
keyboard_listener = None
recording_lock = threading.Lock()

def on_mouse_move(x, y, dx, dy):
    with recording_lock:
        recording_data.append((x, y, "mousemove"))

def on_click(x, y, button, pressed):
    with recording_lock:
        action = "mousedown" if pressed else "mouseup"
        recording_data.append((x, y, action))

def on_scroll(x, y, dx, dy):
    with recording_lock:
        recording_data.append((x, y, f"scroll({dx},{dy})"))

def on_press(key):
    with recording_lock:
        try:
            recording_data.append((key.char, "keypress"))
        except AttributeError:
            recording_data.append((str(key), "keypress"))

def start_recording():
    global mouse_listener, keyboard_listener
    with MouseListener(on_move=on_mouse_move) as mouse_listener:
        with KeyboardListener(on_press=on_press) as keyboard_listener:
            mouse_listener.join()
            keyboard_listener.join()

@app.route('/start_recording', methods=['POST'])
def start_recording_endpoint():
    global mouse_listener, keyboard_listener
    with recording_lock:
        recording_data.clear()
        threading.Thread(target=start_recording).start()
    return jsonify({'message': 'Recording started'})

@app.route('/stop_recording', methods=['POST'])
def stop_recording_endpoint():
    global mouse_listener, keyboard_listener
    with recording_lock:
        data_to_return = recording_data.copy()
        recording_data.clear()
        if mouse_listener:
            mouse_listener.stop()
        if keyboard_listener:
            keyboard_listener.stop()
    return jsonify({'data': data_to_return})

if __name__ == '__main__':
    app.run()
