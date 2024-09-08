import { Request, Response } from 'express';
import {OpenAI} from "openai";
import {Project, Thread, ThreadMessage, User} from "../models";
import dotenv from "dotenv";

dotenv.config()

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY is missing');
}

const openai = new OpenAI({
    apiKey: openaiApiKey
});

export const createThread = async (req: Request, res: Response) => {
    const user = req.user
    try {
        const newThread = await Thread.create({})
        if (newThread) {
            const updatedUser = await User.findOneAndUpdate({_id: user._id},
                {threads: [...user.threads, newThread]}).select('-password').populate('threads')
            if (updatedUser) {
                res.success(newThread, 'New thread created successfully', 201, false);
            } else {
                res.error({message: 'User not updated'}, 400, false);
            }
        } else {
            res.error({message: 'Thread not created'}, 500, false);
        }
    } catch (err:any) {
        res.error({message: 'Internal Server Error', details: err.message}, 500, true);
    }
};

export const getThreads = async (req: Request, res: Response) => {
    try {
        const threads = req.user.threads
        if (threads) {
            res.success(threads, 'Threads fetched successfully', 200, false);
        } else {
            res.error({message: 'No threads found'}, 404, false);
        }
    } catch (err:any) {
        res.error({message: 'Internal Server Error', details: err.message}, 500, true);
    }
}

export const updateThread = async (req: Request, res: Response) => {
    const threadId = req.params.threadId;
    const {title} = req.body;
    try {
        const updatedThread = await Thread.findOneAndUpdate({_id: threadId},
            {title}, {new: true}).populate('messages')
        if (updatedThread) {
            res.success(updatedThread, 'Thread updated successfully', 200, false);
        } else {
            res.error({message: 'Thread not updated'}, 400, false);
        }
    } catch (err: any) {
        res.error({message: 'Internal Server Error', details: err.message}, 500, true);
    }
}

export const deleteThread = async (req: Request, res: Response) => {
    const userId = req.user._id
    const threadId = req.params.threadId;
    try {
        const user = await User.findOne({_id: userId})
        if (user) {
            const deletedThread = await Thread.findOneAndDelete({_id:threadId}).populate('messages')
            const messages = await ThreadMessage.deleteMany({_id: {$in: deletedThread!.messages}})
            if (deletedThread && messages) {
                const updatedUser = await User.findOneAndUpdate({_id: userId},
                    {threads: user.threads.filter((t: any) => t._id.toString()!== threadId)}).select('-password').populate([
                        { path: 'profile', select: '-__v' },
                    { path: 'threads', populate: { path:'messages', select: '-__v' } },
                ])
                if (updatedUser) {
                    res.success(updatedUser, 'Thread deleted successfully', 200, false);
                } else {
                    res.error({message: 'User not updated'}, 400, false);
                }
            } else {
                res.error({message: 'Thread not found'}, 404, false);
            }} else {
            res.error({message: 'User not found'}, 404, false);
        }
    } catch (err: any) {
        res.error({message: 'Internal Server Error', details: err.message}, 500, true);
    }
}

export const createThreadMessage = async (req: Request, res: Response) => {
    const user = req.user;
    const {text} = req.body;
    const threadId = req.params.threadId;

    try {
        // Fetch the user's projects where they are a member
        const projects = await Project.find({ members: user._id });

        if (!projects || projects.length === 0) {
            return res.error({ message: 'No projects found for user' }, 404, false);
        }

        // Extract the relevant project information for context
        const projectContext = projects.map(project =>
            `Project: ${project}, Name: ${project.projectName}, Description: ${project.projectDescription}`).join('\n');

        // Save the user message
        const userMessage: any = await ThreadMessage.create({
            text,
            sender: 'user',
        });
        await userMessage.save();

        // Find the thread
        const thread = await Thread.findOne({_id: threadId}).populate("messages");
        if (thread) {
            if (userMessage) {
                thread.messages.push(userMessage._id);
                await thread.save();
            } else {
                res.error({message: 'Message not created'}, 500, false);
            }
            // Create prompt for OpenAI, using both the user's message and project context
            const prompt = `You are an assistant. The user is working on the following projects:\n${projectContext}\nThe user asks: ${text}\nPlease provide a helpful response.`;

            // Call OpenAI to generate a response
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{role: "system", content: "You are a helpful assistant."},
                    {role: "user", content: prompt}],
            });
            if (completion?.choices.length > 0 && completion.choices[0].message.content) {
                const assistantResponse = completion.choices[0].message.content.trim();
                // Save the assistant's response as a message
                const assistantMessage: any = await ThreadMessage.create({
                    text: assistantResponse,
                    sender: 'assistant',
                });
                await assistantMessage.save();
                if (assistantMessage) {
                    thread.messages.push(assistantMessage._id);
                    await thread.save();
                    const updatedThread = await Thread.findOne({_id: threadId}).populate("messages")
                    res.success(updatedThread, 'Message added and assistant response generated', 200, false);
                } else {
                    res.error({message: 'Message not created'}, 500, false);
                }
            } else {
                res.error({message: 'Assistant response not generated'}, 500, false);
            }
        } else {
            res.error({message: 'Thread not found'}, 404, false);
        }
    } catch (error: any) {
        res.error({ message: 'Internal Server Error', details: error.message }, 500, true);
    }
}

