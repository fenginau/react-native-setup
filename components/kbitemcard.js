import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Icon, Button, Text, Card, CardItem, Thumbnail, Left, Body, View } from 'native-base';
import Rest from '../js/rest';
import RNFS from 'react-native-fs';
import realm from '../js/realm';

export default class KbItemCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            loaded: false,
            item: null,
            imgDownloaded: false
        };
    }

    componentDidMount() {
        var items = realm.objects('InfoSimple').filtered(`id = ${this.props.item.id}`);
        if (items == null || items.length == 0) {
            this.getInfoSimple(false).catch((error) => {
                console.error(error);
            });
        } else {
            for (let item of items) {
                if (item.timestamp != this.props.item.timestamp) {
                    this.getInfoSimple(true).catch((error) => {
                        this.showStoredItem(item)
                    });
                } else {
                    this.showStoredItem(item);
                }
                break;
            }
        }
    }

    showStoredItem(item) {
        if (item.headerImagePath != '') {
            this.setState({ item: item, loaded: true, imgDownloaded: true });
        } else {
            this.setState({ item: item, loaded: true });
        }
    }

    getInfoSimple(isUpdate) {
        return Rest.getInfoSimple(this.props.item.id).then(result => {
            var item = {
                id: this.props.item.id,
                description: result.description,
                blurb: result.blurb,
                headerImageUrl: result.headerImageUrl,
                headerImagePath: '',
                timestamp: result.timestamp
            };
            this.setState({ item: item, loaded: true });

            var imgPath = `${RNFS.DocumentDirectoryPath}/InfoHeadImg_${result.headerImageId}.jpg`;
            realm.write(() => {
                realm.create('InfoSimple', item, isUpdate);
            });

            RNFS.downloadFile({
                fromUrl: result.headerImageUrl.includes('%') ? result.headerImageUrl : encodeURI(result.headerImageUrl),
                toFile: imgPath
            }).promise.then(res => {
                item.headerImagePath = `file://${imgPath}`;
                realm.write(() => {
                    realm.create('InfoSimple', {
                        id: this.props.item.id,
                        headerImagePath: item.headerImagePath
                    }, true);
                });
                this.setState({ item: item, imgDownloaded: true });
            });

        });
    }

    gotoKb = () => {
        this.props.navigation.navigate('KnowledgeItem', {
            itemId: this.props.item.id
        });
    }

    render() {
        var navigation = this.props.navigation;
        if (this.state.loaded) {
            return (
                <TouchableOpacity onPress={this.gotoKb.bind(this)} activeOpacity={1}>
                    <Card style={{ flex: 0 }}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{ uri: 'https://pic3.zhimg.com/50/v2-596d7e85d09d32ac0450a1c778cfa276_hd.jpg' }} />
                                <Body>
                                    <Text>{this.state.item.description}</Text>
                                    <Text note>April 15, 2016</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                {this.state.imgDownloaded
                                    ? (<Image source={{ uri: this.state.item.headerImagePath }} style={{ height: 200, width: '100%', flex: 1 }} />)
                                    : (<View style={{ height: 200, width: '100%', flex: 1, backgroundColor: 'grey' }} />)}
                                <Text>
                                    {this.state.item.blurb}
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent textStyle={{ color: '#87838B' }}>
                                    <Icon name="logo-github" />
                                    <Text>1,926 stars</Text>
                                </Button>
                            </Left>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
            );
        } else {
            return (
                <Card style={{ flex: 0 }}>
                    <CardItem>
                        <Left>
                            <Thumbnail source={{ uri: 'https://pic3.zhimg.com/50/v2-596d7e85d09d32ac0450a1c778cfa276_hd.jpg' }} />
                            <Body>
                                <Text>......</Text>
                                <Text note>April 15, 2016</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <View style={{ height: 200, width: '100%', flex: 1, backgroundColor: 'grey' }} />
                            <Text>
                                ......
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Button transparent textStyle={{ color: '#87838B' }}>
                                <Icon name="logo-github" />
                                <Text>1,926 stars</Text>
                            </Button>
                        </Left>
                    </CardItem>
                </Card>
            );
        }
    }
}