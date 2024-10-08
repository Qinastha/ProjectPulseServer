import { Request, Response } from 'express';
import { Message, Chat } from "../models";
import {ObjectId} from "mongodb";

export const createMessage = async (message:any) => {
    const { chatId, sender, content } = message;

    try {
        const newMessage = await Message.create({
            sender: new ObjectId(sender),
            content,
        });

        if (newMessage) {
            const chat = await Chat.findOneAndUpdate(
                {_id: chatId},
                { $push: { messages: newMessage._id } },
                { new: true }
            );

            if (chat) {
                return newMessage.populate({
                    path:'sender',
                    model: 'User',
                    populate: {
                        path: 'profile',
                        model: 'Profile',
                    },
                })
            }
        } return null;
    } catch (err: any) {
        console.log(err)
    }
};

export const getMessages = async (req: Request, res: Response) => {
    const chatId = req.params.chatId;

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

export const deleteMessage = async (chatId: string, messageId: string) => {
    try {
        const message = await Message.findOneAndDelete({_id:messageId});

        if (message) {
            const chat = await Chat.findOneAndUpdate(
                {_id: chatId},
                { $pull: { messages: messageId } },
                { new: true }
            );

            if (chat) {
                return messageId
            } return null
        }
    } catch (err: any) {
        console.log(err);
    }
};


export const updateMessage = async (messageId: string, content: string) => {

    try {
        const message = await Message.findOneAndUpdate(
            {_id: messageId},
            { content, updatedAt: new Date() },
            { new: true }
        );

        if (message) {
            return message.populate({
                path:'sender',
                model: 'User',
                populate: {
                    path: 'profile',
                    model: 'Profile',
                },
            })
        } return null
    } catch (err: any) {
        console.log(err)
    }
};
