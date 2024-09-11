import { Request, Response } from 'express';
import {OpenAI} from "openai";
import {IProject, ITask, ITaskList, IUser, Project, Thread, ThreadMessage, User} from "../models";
import dotenv, {populate} from "dotenv";
import {ITaskChecklistItem} from "../models/interfaces";

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
        const projects = await Project.find({ members: user._id }).populate([{
            path: 'taskLists',
            model: 'TaskList',
            populate: {
                path: 'tasks',
                model: 'Task',
                populate: [{
                    path:'members',
                    model: 'User',
                    select: 'firstName lastName email'
                },{
                    path:'creator',
                    model: 'User',
                    select: 'firstName lastName email'
                }]
            }
        },{
            path:'members',
            model: 'User',
            select: 'firstName lastName email'
        },{
            path:'creator',
            model: 'User',
            select: 'firstName lastName email'
        }]);

        if (!projects || projects.length === 0) {
            return res.error({ message: 'No projects found for user' }, 404, false);
        }

        // Extract the relevant project information for context
        const projectContext = projects.map((project: IProject) => {
            const creator = project.creator as unknown as IUser | null;
            const creatorName = creator
                ? `${creator.firstName} ${creator.lastName} ${creator.email}`
                : 'Unknown creator';

            const members = project.members as unknown as IUser[];
            const memberNames = members.map((member: IUser) => `${member.firstName} ${member.lastName} ${member.email}`).join(', ');

            const taskListDetails = (project.taskLists as unknown as ITaskList[]).map((taskList: ITaskList) => {
                const taskDetails = (taskList.tasks as unknown as ITask[]).map((task: ITask) => {
                    const taskCreator = task.creator as unknown as IUser | null;
                    const taskCreatorName = taskCreator
                        ? `${taskCreator.firstName} ${taskCreator.lastName}`
                        : 'Unknown creator';

                    const taskMembers = task.members as unknown as IUser[];
                    const taskMemberNames = taskMembers.map((member: IUser) => `${member.firstName} ${member.lastName}`).join(', ');

                    const checklistDetails = task.checkList?.map((item: ITaskChecklistItem) =>
                        `Item: ${item.text}, Completed: ${item.isCompleted}`).join(', ') || 'No checklist';

                    return `Task Title: ${task.title}, Description: ${task.description}, Creator: ${taskCreatorName}, Members: ${taskMemberNames}, Status: ${task.taskStatus}, Checklist: ${checklistDetails}`;
                }).join(' ');

                return `Task List: ${taskList.taskListName}\nTasks:\n${taskDetails}`;
            }).join(' ');

            return `Project: ${project.projectName}\nDescription: ${project.projectDescription}\nCreator: ${creatorName}\nMembers: ${memberNames}\nTask Lists:\n${taskListDetails}`;
        }).join(' ');

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
            let prompt = `You are a helpful assistant. The user is working on the following projects: ${projectContext}. Based on the user's input: "${text}", provide an accurate and concise response. If the question is unclear, ask the user for clarification. Only provide details when specifically requested. Avoid unnecessary symbols and formatting like lists or bullet points. Respond with a simple, plain text answer.`;

            // Handle cases where the user doesn't specify a project-related question
            if (!projectContext.trim()) {
                prompt = `The user has asked: "${text}". However, no project information is available. Kindly ask the user for more details about the relevant project if necessary. Respond with a concise, plain text answer without unnecessary symbols.`;
            }

            // Call OpenAI to generate a response
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{role: "system", content: "You are a helpful assistant."},
                    {role: "user", content: prompt}],
                max_tokens: 150,
            });
            if (completion?.choices.length > 0 && completion.choices[0].message.content) {
                let assistantResponse = completion?.choices?.[0]?.message?.content?.trim();
                if (!assistantResponse) {
                    return res.error({ message: 'Assistant response not generated' }, 500, false);
                }
                assistantResponse = assistantResponse.replace(/[*_~`]/g, '');
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

