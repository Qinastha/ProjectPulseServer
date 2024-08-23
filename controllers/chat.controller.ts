import { Request, Response } from 'express';
import {Chat, Message, Project} from "../models";

export const createChat = async (req: Request, res:Response) => {
  const {name, description, avatar, currentProject} = req.body
    try {
      const project = await Project.findOne({_id:currentProject})
      if(project) {
          const newChat = await Chat.create({
            name,
            description,
            avatar,
            currentProject,
            members: [...project.members, req.user._id]
          })
          if(newChat) {
              const updatedProject = await Project.findOneAndUpdate({_id:currentProject},
                  {chats:[...project.chats, newChat]}, {new:true})
              if(updatedProject) {
                  res.success(newChat, 'Chat created successfully', 201, false)
              }else {
                  res.error({message: 'Project not updated'}, 400, false)
              }
          }else {
              res.error({message: 'Chat not created'}, 400, false)
          }
      }else {
          res.error({message: 'Project not found'}, 404, false)
      }
    } catch(err:any) {
        res.error({message: 'Internal Server Error',details: err.message},500,true)
    }
}

export const updateChat = async (req: Request, res: Response) => {
    const chatId = req.params.chatId
    const {name, description, avatar, members} = req.body

    try {
        const chat = await Chat.findOneAndUpdate({_id: chatId},
            {name, description, avatar, members}, {new: true}).populate([{
            path: 'currentProject',
            model: 'Project'
        }, {
                path: 'members',
                model: 'User',
                populate: {
                    path: "profile",
                    model: "Profile",
                }
            }, {
                path:"messages",
                model: "Message",
                populate: {
                    path: 'sender',
                    model: 'User',
                    populate: {
                        path: "profile",
                        model: "Profile",
                    }
                }
        }
            ])
        if(chat) {
            res.success(chat, 'Chat updated successfully', 200, false)
        } else {
            res.error({message: 'Chat not found'}, 404, false)
        }
    } catch(err:any) {
        res.error({message: 'Internal Server Error',details: err.message},500,true)
    }
}

export const deleteChat = async (req: Request, res: Response) => {
    const chatId = req.params.chatId;
    try {
        const project = await Project.findOne({chats:{$in:[chatId]} });
        if (project) {
            const chat = await Chat.findOneAndDelete({ _id: chatId });
            const messages = await Message.deleteMany({_id: {$in: chat!.messages}})
            if (chat && messages) {
                const updatedProject = await Project.findOneAndUpdate(
                    { _id: project._id },
                    { $pull: { chats: chat._id } },
                    { new: true }
                );
                if (updatedProject) {
                    res.success(req.projects, 'Chat deleted successfully', 200, false);
                } else {
                    res.error({ message: 'Project not updated' }, 400, false);
                }
            } else {
                res.error({ message: 'Chat not found' }, 404, false);
            }
        } else {
            res.error({ message: 'Project not found' }, 404, false);
        }
    } catch (err: any) {
        res.error({ message: 'Internal Server Error', details: err.message }, 500, true);
    }
};

