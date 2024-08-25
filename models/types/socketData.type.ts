import {IMessage, IUser} from "../schemas";

export type SocketData = {
    chatId: string;
    messageId: string;
    content: string;
    message: IMessage;
    sender: IUser;
}