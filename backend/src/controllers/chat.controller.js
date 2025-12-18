import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { Chat } from "../models/chatRoom.models.js";
import { Message } from "../models/message.models.js";
import { getIO } from "../socket.js";
import mongoose from "mongoose";

const createMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new ApiError(400, "Invalid chatId");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Message content is required");
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  // ✅ create message
  const message = await Message.create({
    chat: chatId,
    sender: req.user?._id,
    content
  });

  // 🔥 EMIT SOCKET EVENT
  const io = getIO();
  io.to(chatId).emit("receive-message", {
    _id: message._id,
    chat: chatId,              // 🔥 REQUIRED for frontend filter
    sender: req.user._id,
    content: message.content,
    createdAt: message.createdAt
  });

  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message created successfully"));
});
const createChatRooms = asyncHandler(async (req, res) => {
    const { username } = req.body
    if (!username) {
        throw new ApiError(400, "username is required")
    }
    const myId = req.user._id
    const otherUser = await User.findOne({ username })
    if (!otherUser) {
        throw new ApiError(400, "user not found")
    }
    if (String(req.user._id) === String(otherUser._id)) {
        throw new ApiError(400, "you cant create chat with yourself")
    }
    //if chat already exists
    let chat = await Chat.findOne({
        isGroup: false,
        members: { $all: [myId, otherUser._id] }
    }).populate("members", "username avatar fullName");

    // If not exists → create
    if (!chat) {
        chat = await Chat.create({
            members: [myId, otherUser._id]
        });

        chat = await Chat.findById(chat._id)
            .populate("members", "username avatar fullName");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            chat,
            "Chat room ready"
        )
    );
})
const getallChatRooms = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const chats = await Chat.aggregate([
        {
            $match: {
                members: new mongoose.Types.ObjectId(userId),
                isGroup: false
            }
        },
        {
            $lookup: {
                from: "messages",
                let: { chatId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$chat", "$$chatId"] }
                        }
                    },
                    { $sort: { createdAt: -1 } },
                    { $limit: 1 }
                ],
                as: "lastMessage"
            }
        },
        {
            $addFields: {
                lastMessage: { $first: "$lastMessage" }
            }
        },

        //  Get the other user (chatWith) //not clear
        {
            $lookup: {
                from: "users",
                let: { members: "$members" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$members"] },
                                    { $ne: ["$_id", new mongoose.Types.ObjectId(userId)] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1
                        }
                    }
                ],
                as: "chatWith"
            }
        },
        {
            $addFields: {
                chatWith: { $first: "$chatWith" }
            }
        },
        {
            $project: {
                members: 0
            }
        },
        {
            $sort: {
                "lastMessage.createdAt": -1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            chats,
            "All chat rooms fetched successfully"
        )
    );
});
const chatHistory = asyncHandler(async (req, res) => { //need to be understand
    const { chatId } = req.params;
    const messages = await Message.aggregate([
        {
            $match: { chat: new mongoose.Types.ObjectId(chatId) }
        },
        {
            $sort: { createdAt: 1 }, // oldest → newest
        },
        {
            $lookup: {
                from: "users",
                localField: "sendeTo",
                foreignField: "_id",
                as: "sendeTo",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                sender: { $first: "$sender" },
            },
        },
        {
            $addFields: {
                sendeTo: { $first: "$sendeTo" },
            },
        },
        {
            $group: {
                _id: "$chat",
                sendeTo: { $first: "$sendeTo" },
                messages: {
                    $push: {
                        _id: "$_id",
                        sender:"$sender",
                        content: "$content",
                        sendeTo: "$sendeTo",
                        createdAt: "$createdAt",
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                chatId: "$_id",
                sendeTo:1,
                sender:1,
                messages: 1,
            },
        }
    ])
    return res.status(200).json(new ApiResponse(200, messages, "Chat history retrieved successfully"));
})

export {
    createMessage,
    createChatRooms,
    getallChatRooms,
    chatHistory
}
