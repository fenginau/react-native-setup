import React from 'react';
import { Image, TouchableOpacity, CameraRoll, FlatList, Dimensions } from 'react-native';
import { Container, Header, Content, Left, Body, Right, Button, Title, Icon, Text, View } from 'native-base';
import Rest from '../js/rest';
import RNFS from 'react-native-fs';
import realm from '../js/realm';
import I18n from '../js/i18n';

export default class PhotoAlbumScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            photo: '',
            item: '',
            title: '',
            refreshing: false,
            columns: 0,
            imgWidth: 0,
            cursor: '',
            end: false
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        const item = navigation.getParam('item', '');
        const title = navigation.getParam('title', '');

        // calculate the column number
        let screenWidth = Dimensions.get('window').width;
        let columns = 0;
        let imgWidth = screenWidth;
        for (let i = 2; i < 20; i++) {
            let tempPw = screenWidth / i;
            if (Math.abs(120 - imgWidth) > Math.abs(120 - tempPw)) {
                imgWidth = tempPw;
                columns = i;
            } else {
                break;
            }
        }

        this.setState({ item, title, columns, imgWidth });
    }

    componentDidMount() {
        this.loadPhoto(null);
    }

    loadPhoto() {
        if (!this.state.end) {
            CameraRoll.getPhotos({
                first: 20,
                assetType: 'Photos',
                after: this.state.cursor
            }).then(r => {
                this.setState({ photos: [...this.state.photos, ...r.edges], cursor: r.page_info.end_cursor, end: !r.page_info.has_next_page });
            }).catch((err) => {
                console.error(err);
            });
        }
    }

    onSelectPhoto(url) {
        this.onSaveChange(url);
    }

    onSaveChange(url) {
        const { navigation } = this.props;
        navigation.state.params.returnData(this.state.item, url);
        navigation.goBack();
    }

    render() {
        return (
            <Container style={{ backgroundColor: 'black' }}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => { this.props.navigation.goBack() }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.state.title}</Title>
                    </Body>
                    <Right>
                        {this.state.multi && (
                            <Button transparent onPress={this.onSaveChange.bind(this, this.state.photo)}>
                                <Text>{I18n.t('Save')}</Text>
                            </Button>)}
                    </Right>
                </Header>
                <FlatList
                    style={{ flexDirection: 'column' }}
                    data={this.state.photos}
                    numColumns={this.state.columns}
                    refreshing={this.state.refreshing}
                    renderItem={({ item }) => {
                        let picWidth = item.node.image.width;
                        let picHeight = item.node.image.height;
                        let imgWidth = this.state.imgWidth;
                        let viewHeight = imgWidth * 4 / 3;
                        let imgHeight = picHeight / picWidth * imgWidth > viewHeight - 2 ? viewHeight - 2 : picHeight / picWidth * imgWidth;
                        return (
                            <TouchableOpacity onPress={this.onSelectPhoto.bind(this, item.node.image.uri)} activeOpacity={1}>
                                <View style={{ height: viewHeight, width: imgWidth, borderWidth: 1, borderColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        style={{ height: imgHeight, width: imgWidth - 2, alignSelf: 'center' }}
                                        source={{ uri: item.node.image.uri }} />
                                </View>
                            </TouchableOpacity>);
                    }}
                    onEndReached={this.loadPhoto.bind(this)}
                />
            </Container>
        );
    }
}