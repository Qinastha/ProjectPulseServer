import {createMessage} from "./controllers";

export default (io:any) => {
    io.on('connection', (socket:any) => {
        socket.on('joinChat', (chatId: string) => {
            socket.join(chatId);
        });

        socket.on('sendMessage', async (data:any) => {
            const { chatId, message } = data;
            const newMessage = await createMessage(message)
            if (newMessage) {
                socket.emit('message', newMessage)
                socket.broadcast.to(chatId).emit('message', newMessage)
            }
        });

        socket.on('messageTyping', (data:any) => {
            const { chatId, sender } = data;
            socket.broadcast.to(chatId).emit('typingMessage', sender);
        });

        socket.on('messageStopTyping', (data:any) => {
            const { chatId, sender } = data;
            socket.broadcast.to(chatId).emit('stopTypingMessage', sender);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}