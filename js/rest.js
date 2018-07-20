import React from 'react';
import Global from '../js/global';

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
        return this.get(`knowledgebaseapi/getknowledgebaseSingle/${Global.hardwareId}/${itemId}`);
    }
}