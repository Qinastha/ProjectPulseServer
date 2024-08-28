import {createMessage, deleteMessage, updateMessage} from "./controllers";
import {SocketData} from "./models";
import {Socket} from "socket.io";

export default (io:any) => {
    io.on('connection', (socket: Socket) => {
        socket.on('joinChat', (chatId: string) => {
            socket.join(chatId);
        });

        socket.on('sendMessage', async (data: Partial<SocketData>) => {
            try {
                if (data.chatId && data.message) {
                    const { chatId, message } = data;

                    const newMessage = await createMessage(message);
                    if (newMessage) {
                        socket.emit('message', newMessage);
                        socket.broadcast.to(chatId).emit('message', newMessage);
                    }
                }
            } catch (error: any) {
                socket.emit('error', { message: 'Socket Error', details: error.message }, 500, false);
            }
        });

        socket.on('messageTyping', (data: Partial<SocketData>) => {
            if (data.chatId && data.sender) {
                const { chatId, sender } = data;
                socket.broadcast.to(chatId).emit('typingMessage', sender);
            }
        });

        socket.on('messageStopTyping', (data: Partial<SocketData>) => {
            if (data.chatId && data.sender) {
                const { chatId, sender } = data;
                socket.broadcast.to(chatId).emit('stopTypingMessage', sender);
            }
        });

        socket.on('editMessage', async (data: Partial<SocketData>) => {
            try {
                if (data.chatId && data.messageId && data.content) {
                    const { chatId, messageId, content } = data;
                    const updatedMessage = await updateMessage(messageId, content);
                    socket.broadcast.to(chatId).emit('messageEdit', updatedMessage);
                }
            } catch (error: any) {
                socket.emit('error', { message: 'Socket Error', details: error.message }, 500, false);
            }
        });

        socket.on('deleteMessage', async (data: Partial<SocketData>) => {
            try {
                if (data.chatId && data.messageId) {
                    const { chatId, messageId } = data;
                    const deletedMessageId = await deleteMessage(chatId, messageId);
                    socket.broadcast.to(chatId).emit('messageDelete', deletedMessageId);
                }
            } catch (error: any) {
                socket.emit('error', { message: 'Socket Error', details: error.message }, 500, false);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}