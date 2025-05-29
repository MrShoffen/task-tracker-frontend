import {API_BASE_URL, API_CONTEXT} from "../../../UrlConstants.jsx";
import SockJS from 'sockjs-client/dist/sockjs';
import {Stomp} from "@stomp/stompjs";


export function connectToWebsocket(workspaceId){

    const socket = new SockJS(API_BASE_URL + API_CONTEXT + "/websocket");

    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () =>{
        stompClient.subscribe('/topic/workspace/' + workspaceId,
            (message) =>{
                console.log('success!!')
                console.log('Получено обновление', JSON.parse(message.body))
        })
    })
}