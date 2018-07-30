import React from 'react';
import Global from './global';

export default class Rest extends React.Component {
    static get(url) {
        return fetch(`${Global.nsServer}/api/${url}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': Global.getBase64Auth()
            }
        }).then((response) => response.json());
    }

    static post(url, body) {
        return fetch(`${Global.nsServer}/api/${url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': Global.getBase64Auth()
            },
            body: JSON.stringify(body)
        }).then((response) => response.json());
    }

    static post2(url, body) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': Global.getBase64Auth()
            },
            body: JSON.stringify(body)
        }).then((response) => response.json());
    }

    static get2(url) {
        return fetch(`${Global.nsServer}/api/${url}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': Global.getBase64Auth()
            }
        }).then((response) => console.log(response));
    }

    static getKbMenu() {
        return this.get(`knowledgebaseapi/getKnowledgebaseMenu?${new Date().getTime()}`);
    }

    static getKbPopular(index, interval) {
        return this.get(`knowledgebaseapi/getKnowledgebasePopular/${Global.hardwareId}/${index}/${interval}`);
    }

    static getKbTitleImage(fileId) {
        return this.get(`knowledgebaseapi/getKnowledgebaseTitleImageUrl/${fileId}`);
    }

    static getKbItem(itemId) {
        return this.get(`knowledgebaseapi/getknowledgebaseSingle/${Global.hardwareId}/${itemId}?${new Date().getTime()}`);
    }

    static sendMessage(message) {
        return this.post2('http://careintheclouds.com.au/fcmtest/api/values', message);
    }

    static sendMessageDirect(message) {
        return fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAYD651D0:APA91bGa0ZDxdyDYS8VZYs7LDcVjgEohnXGmI5inQqOBFD5eUNrcFJkxm5-lE4tI5Tgxn7KKenin7rN4bYUiS_0MXXfR8HTazF2-0dHx-kFByf4mA49jxZCc1X5XdM7uPhbfzEFZ28g56Wb21zvSs8bjPuUx_Q0_Hg'
            },
            body: JSON.stringify({to: message.target, data: message})
        }).then((response) => response.json());
    }
}