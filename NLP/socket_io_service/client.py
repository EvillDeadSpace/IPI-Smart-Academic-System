import socketio

sio = socketio.Client()


@sio.event
def connect():
    print("Povezano na server")
    sio.emit("chat_message", "Pozdrav serveru!")


@sio.event
def message(data):
    print("Primljeno od servera:", data)


@sio.event
def disconnect():
    print("Odspojeno sa servera")


sio.connect("http://localhost:5000")
sio.wait()
