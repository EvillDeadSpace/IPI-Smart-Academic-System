import socketio
from aiohttp import web


# Create a socket IO server
server_io = socketio.AsyncServer()
app = web.Application()
server_io.attach(app)


# Event when client is connected
@server_io.event
async def connect(sid, environ):
    print(f"Client is  connected {sid}")
    await server_io.emit("message", {"msg": "Wellcome"}, to=sid)


@server_io.event
async def chat_message(sid, data):
    print(f"Poruka od {sid}: {data}")
    await server_io.emit("message", {"msg": f"Server je primio: {data}"})


@server_io.event
async def disconnect(sid):
    print(f"Klijent odspojen: {sid}")


if __name__ == "__main__":
    web.run_app(app, port=5000)
