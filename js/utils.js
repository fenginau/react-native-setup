import React from 'react';
import { Dimensions, Image } from 'react-native';
import I18n from '../js/i18n';

export default class Utils extends React.Component {
    static isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    // maxWidth > 1 then actual pixel, <= 1 then ratio of the window width
    static getImageSize(source, maxWidth, fixWidth = false) {
        return new Promise((resolve, reject) => {
            var winWidth = Dimensions.get('window').width;
            Image.getSize(source, (width, height) => {
                var adjustWith = fixWidth
                    ? maxWidth > 1
                        ? maxWidth
                        : winWidth * maxWidth
                    : maxWidth > 1
                        ? Math.min(winWidth, width, maxWidth)
                        : Math.min(winWidth * maxWidth, width);
                var adjustHeight = adjustWith * height / width;
                resolve([adjustWith, adjustHeight]);
            });
        });
    }

    static getEmptyError(field) {
        return I18n.t('emptyField').replace('$1', I18n.t(field));
    }

    static isEmail(text) {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(text).toLowerCase());
    }

    static executeAsync(func) {
        setTimeout(func, 0);
    }
}