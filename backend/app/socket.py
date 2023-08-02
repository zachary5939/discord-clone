import os
from .models import DirectMessage, ChannelMessage, Channel, db, User
from flask_socketio import SocketIO, emit, send
from datetime import datetime


if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://slacord.onrender.com",
        "https://slacord.onrender.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)

# handle chat messages


@socketio.on("connect")
def connection(data):
    print("User connected!")


@socketio.on("chat")
def handle_chat(data):
    print("THIS WAS HIT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    # if data != "User connected!":
    # dm = DirectMessage (
    #         sender_id=data['sender_id'],
    #         recipient_id=data['recipient_id'],
    #         message=data['msg'],
    #         sent_at="hi"
    #     )
    #     db.session.add(dm)
    #     db.session.commit()

    emit("chat", data, broadcast=True)


# ! make sure to implement permission checks
@socketio.on("channel_message")
def handle_channel_message(data):
    print(f"User {data['user']['username']} sent channel Message")
    channel = Channel.query.get(data['channel_id'])
    if not channel:
        return
    # set user status
    user = User.query.get(data['user']['id'])
    if user:
        user.last_seen = datetime.utcnow()
    new_channel_message = ChannelMessage(
        content=data['message'], user_id=data['user']['id'])
    channel.channel_messages.append(new_channel_message)
    db.session.commit()
    # TODO FIX THIS UP
    emit(f"server-channel-messages-{data['server_id']}",
         {
             "content": data['message'],
             "created_at": f"{new_channel_message.created_at}",
             "user_id": data['user']['id'],
             "channel_id": data['channel_id'],
             "updated": False
         }, broadcast=True)
    emit(f"server-channel-messages-notifications-{data['server_id']}",
         {
             "user_id": data['user']['id'],
             "channel_id": data['channel_id'],
         }, broadcast=True)
