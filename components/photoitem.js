import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Container, Icon, Button, Text, Card, CardItem, Thumbnail, Left, Body } from 'native-base';
import Rest from '../js/rest';
import RNFS from 'react-native-fs';
import realm from '../js/realm';
import I18n from '../js/i18n';

export default class PhotoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: null
        };
    }

    componentDidMount() {
        if (this.props.url != null && this.props.url != '') {
            RNFS.exists(this.props.url).then(result => {
                if (result) {
                    this.setState({ url: this.props.url });
                }
            });
        }
    }

    render() {
        if (this.state.url != null) {
            return (
                <View>
                    <View style={{ flex: 0.4 }}>
                        <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../resourse/images/grey.jpg')} />
                    </View>
                    <View style={{ flex: 0.6 }}>
                        <Button>
                            <Text>{I18n.t('EditPhoto')}</Text>
                        </Button>
                    </View>
                </View>);
        } else {
            return (
                <View style={{ flexDirection: 'row', padding: 24 }}>
                    <View style={{ flex: 0.4 }}>
                        <Image style={{ width: 200, height: 200, alignSelf: 'center' }} source={require('../resourse/images/grey.jpg')} />
                    </View>
                    <View style={{ flex: 0.6, justifyContent: 'center' }}>
                        <Button>
                            <Text>{I18n.t('EditPhoto')}</Text>
                        </Button>
                    </View>
                </View>);
        }
    }
}