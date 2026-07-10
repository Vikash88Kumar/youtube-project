import { Notification } from "../models/notification.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const getUserNotifications = asyncHandler(async (req, res) => {
    let { page = 1, limit = 20 } = req.query;
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const notifications = await Notification.aggregate([
        {
            $match: {
                recipient: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "senderDetails",
                pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }]
            }
        },
        { $addFields: { sender: { $first: "$senderDetails" } } },
        { $project: { senderDetails: 0 } }
    ]);

    const totalNotifications = await Notification.countDocuments({ recipient: req.user._id });
    
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                notifications,
                pagination: {
                    total: totalNotifications,
                    page,
                    limit,
                    totalPages: Math.ceil(totalNotifications / limit)
                }
            },
            "Notifications fetched successfully"
        )
    );
});

const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );

    return res.status(200).json(
        new ApiResponse(200, {}, "All notifications marked as read")
    );
});

export {
    getUserNotifications,
    markAllAsRead
};
