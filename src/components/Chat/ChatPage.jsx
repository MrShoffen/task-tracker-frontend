import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
// import ChatMessage from "./ChatMessage.jsx";
import { Button, TextField, Container, Box } from '@mui/material';


export default function ChatPage({ username }) {
    const [client, setClient] = useState(null);
    const messageInputRef = useRef();

    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        const connect = () => {
            const sockJS = new SockJS(`http://localhost:8075/ws`);

            sockJS.onopen = () => {
                console.log('WebSocket connected');
                setConnected(true);
                setSocket(sockJS);

                // Отправляем ping каждые 30 секунд для поддержания соединения
                const pingInterval = setInterval(() => {
                    if (sockJS.readyState === 1) {
                        sockJS.send(JSON.stringify({ type: 'PING' }));
                    }
                }, 30000);

                sockJS.pingInterval = pingInterval;
            };

            sockJS.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log('Received message:', message);
                setMessages(prev => [...prev, message]);
            };

            sockJS.onclose = () => {
                console.log('WebSocket disconnected');
                setConnected(false);
                setSocket(null);

                if (sockJS.pingInterval) {
                    clearInterval(sockJS.pingInterval);
                }

                // Переподключение через 3 секунды
                reconnectTimeoutRef.current = setTimeout(connect, 3000);
            };

            sockJS.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socket) {
                socket.close();
            }
        };
    }, [username]);

    const sendMessage = () => {
        if (messageInputRef.current.value && client) {
            const chatMessage = {
                sender: username,
                content: messageInputRef.current.value,
                type: 'CHAT',
            };
            client.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify(chatMessage) });
            messageInputRef.current.value = '';
        }
    };

    return (
        <Container>
            <Box>
                {/*{messages.map((message, index) => (*/}
                {/*    <ChatMessage key={index} message={message} username={username} />*/}
                {/*))}*/}
            </Box>
            <form onSubmit={sendMessage}>
                <TextField inputRef={messageInputRef} placeholder="Type a message..." />
                <Button type="submit">Send</Button>
            </form>
        </Container>
    );
}