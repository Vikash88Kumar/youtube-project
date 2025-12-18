# //model link
# MODEL_LINK= https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj

# //websocket pattern
# Client
#   ↓ (socket)
# send-message
#   ↓
# Socket handler
#   ↓
# Message controller / service
#   ↓
# DB
#   ↓
# Socket emit to room

<!-- Frontend
  └─ socket.emit("send-message")
Backend
  ├─ receive "send-message"
  ├─ create message in DB
  └─ io.to(room).emit("receive-message")
Frontend
  └─ socket.on("receive-message") → UI update -->
