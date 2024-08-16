import { Request, Response } from 'express';
import { Message, Chat } from "../models";

export const createMessage = async (req: Request, res: Response) => {
    const chatId = req.params.chatId
    const { sender, receiver, content } = req.body;

    try {
        const newMessage = await Message.create({
            sender,
            receiver,
            content,
        });

        if (newMessage) {
            const chat = await Chat.findOneAndUpdate(
                {_id: chatId},
                { $push: { messages: newMessage._id } },
                { new: true }
            );

            if (chat) {
                res.success(req.projects, 'Message created successfully', 201, false)
            } else {
                res.error({message: 'Message created but failed to update the chat'}, 400, false)
            }
        } else {
            res.error({message: 'Message not created'}, 400, false)
        }
    } catch (err: any) {
        res.error({ message: 'Internal Server Error'}, 500, false)
    }
};

export const getMessages = async (req: Request, res: Response) => {
    const chatId = req.params.chatId;
    console.log("controllers console to sure ============")
    console.log(req.params)

    try {
        const chat = await Chat.findOne({_id: chatId}).populate({
            path: 'messages',
            model: 'Message',
            populate: [
                {
                    path: 'sender',
                    model: 'User',
                    populate: {
                        path: 'profile',
                        model: 'Profile',
                    },
                },
                {
                    path: 'receiver',
                    model: 'User',
                    populate: {
                        path: 'profile',
                        model: 'Profile',
                    },
                },
            ],
        });

        if (chat) {
            res.success(req.projects, "Messages successfully retrieved", 200 , false)
        } else {
            res.error({message: 'Chat not found'}, 404, false);
        }
    } catch (err: any) {
        res.error({message: 'Internal Server Error', details: err.message}, 500, true);
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    const chatId = req.params.chatId
    const messageId = req.params.messageId;

    try {
        const message = await Message.findOneAndDelete({_id:messageId});

        if (message) {
            const chat = await Chat.findOneAndUpdate(
                {_id: chatId},
                { $pull: { messages: messageId } },
                { new: true }
            );

            if (chat) {
                res.success(req.projects, 'Message deleted successfully', 200, false);
            } else {
                res.error({message: 'Message deleted but failed to update the chat'}, 400, false);
            }
        } else {
            res.error({message: 'Message not found'}, 404, false);
        }
    } catch (err: any) {
        res.error({message: 'Internal Server Error', details: err.message}, 500, true);
    }
};


export const updateMessage = async (req: Request, res: Response) => {
    const messageId = req.params.messageId;
    const { content } = req.body;

    try {
        const message = await Message.findOneAndUpdate(
            {_id: messageId},
            { content, updatedAt: new Date() },
            { new: true }
        );

        if (message) {
            res.success(req.projects, 'Message updated successfully', 200, false);
        } else {
            res.error({message: 'Message not found'}, 404, false);
        }
    } catch (err: any) {
        res.error({message: 'Internal Server Error', details: err.message}, 500, true);
    }
};
