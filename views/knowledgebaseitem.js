import React from 'react';
import { StyleSheet, ImageBackground, Dimensions, ScrollView, Image } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Content, View, Spinner } from 'native-base';
import Drawer from 'react-native-drawer';
import HTML from 'react-native-render-html';
import I18n from '../js/i18n';
import Rest from '../js/rest';
import Sidebar from '../components/sidebar';
import realm from '../js/realm';
import RNFS from 'react-native-fs';
import Utils from '../js/utils';

export default class KnowledgebaseItemScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null,
            itemId: 0,
            html: '',
            loaded: false,
            reloaded: false,
            images: {},
            imgLoaded: {}
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const itemId = navigation.getParam('itemId', 0);
        this.setState({ itemId: itemId }, () => {
            // get item from local or server
            var items = realm.objects('InfoDetail').filtered(`itemId = ${itemId}`);
            if (items == null || items.length == 0) {
                this.getKbItem(itemId, false).catch((error) => {
                    console.error(error);
                });
            } else {
                Rest.getInfoTimestamp(itemId).then(result => {
                    for (let item of items) {
                        if (item.timestamp != result) {
                            this.getKbItem(itemId, true).catch((error) => {
                                console.error(error);
                                // if error, show cached result
                                this.showItem(item);
                            });
                        } else {
                            this.showItem(item);
                        }
                        break;
                    }
                });
            }
        });
    }

    // if load from realm then reload false, from server then true, default false
    showItem(item, reload = false) {
        var regex = /(<img.*?)(\/>)/ig;
        var index = 0;
        // insert anchor to each image for caching
        var html = item.content.replace(regex, (match, p1, p2) => {
            return `${p1} tempId="${index++}" ${p2}`;
        });
        this.setState({ item: item, html: html, loaded: true, reloaded: reload });
    }

    getKbItem(itemId, isUpdate) {
        return Rest.getInfoDetail(itemId).then(item => {
            realm.write(() => {
                realm.create('InfoDetail', item, isUpdate);
            });
            this.showItem(item, true);
        });
    }

    closeDrawer = () => {
        this.drawer.close()
    };

    openDrawer = () => {
        this.drawer.open()
    };

    loadImage(src, order) {
        return new Promise((resolve, reject) => {
            var imgPath = `${RNFS.DocumentDirectoryPath}/InfoImg_${this.state.itemId}_${order}.jpg`;
            RNFS.downloadFile({
                fromUrl: src.includes('%') ? src : encodeURI(src),
                toFile: imgPath
            }).promise.then(res => {
                var fullPath = `file://${imgPath}`;
                realm.write(() => {
                    realm.create('InfoImageStore', {
                        id: `${this.state.itemId}_${order}`,
                        itemId: this.state.itemId,
                        order: parseInt(order),
                        localPath: fullPath,
                        serverPath: src
                    }, true);
                });
                resolve(fullPath);
            }).catch(err => {
                reject(err);
            });
        });
    }

    updateImageState(path, order) {
        var urls = this.state.images;
        var loaded = this.state.imgLoaded;
        Utils.getImageSize(path, 0.8, true).then(([width, height]) => {
            urls[order] = { path, width, height };
            loaded[order] = true;
            this.setState({ images: urls, imgLoaded: loaded });
        });
    }

    renderers = {
        img: (obj) => {
            if (!this.state.imgLoaded[obj.tempid]) {
                if (this.state.reloaded) {
                    // load image from server and save to realm
                    this.loadImage(obj.src, obj.tempid).then(fullPath => {
                        this.updateImageState(fullPath, obj.tempid);
                    });
                } else {
                    // load image from realm
                    var images = realm.objects('InfoImageStore').filtered(`id = "${this.state.itemId}_${obj.tempid}"`);
                    if (images == null || images.length == 0) {
                        // fail to get from realm, try get from server
                        this.loadImage(obj.src, obj.tempid).then(fullPath => {
                            this.updateImageState(fullPath, obj.tempid);
                        });
                    } else {
                        // get image local path from realm
                        for (let image of images) {
                            this.updateImageState(image.localPath, obj.tempid);
                            break;
                        }
                    }
                }
            }

            if (this.state.imgLoaded[obj.tempid]) {
                var img = this.state.images[obj.tempid];
                return (
                    <Image style={{ width: img.width, height: img.height, alignSelf: 'center' }} source={{ uri: img.path }} />);
            } else {
                var winWidth =  Dimensions.get('window').width;
                return (
                    <Image
                        style={{ width: winWidth * 0.8, height: winWidth * 0.8 * 0.75, alignSelf: 'center' }}
                        source={require('../resourse/images/grey.jpg')} />);
            }
        }
    }

    render() {
        return (
            <Drawer
                ref={(ref) => this.drawer = ref}
                content={<Sidebar navigation={this.props.navigation} item={this.state.itemId} />}
                onClose={() => this.closeDrawer()}
                openDrawerOffset={0.2}
                type='overlay'
                side='right'
                acceptPan={true}
                acceptTap={true}
                panOpenMask={0.05}
                styles={drawerStyles}
                panCloseMask={0.2}
                captureGestures={true}
                negotiatePan={true}
                tweenHandler={(ratio) => ({ mainOverlay: { opacity: (ratio) / 2 } })}>
                <Container>
                    <Header searchBar rounded>
                        <Item>
                            <Icon name="ios-search" />
                            <Input placeholder="Search" />
                            <Icon name="menu" onPress={this.openDrawer} />
                        </Item>
                        <Button transparent>
                            <Text>{I18n.t('search')}</Text>
                        </Button>
                    </Header>
                    <Content>
                        {this.state.loaded
                            ? (<View style={styles.titleArea}>
                                <ImageBackground style={styles.imgBg} source={require('../resourse/images/bg_imageintro_768x1024.png')}>
                                    <Text style={styles.title}>{this.state.item.subArea}</Text>
                                    <Text style={styles.titleDesc}>{this.state.item.subAreaDesc}</Text>
                                </ImageBackground>
                                <ScrollView style={{ flex: 1, padding: 16 }}>
                                    <HTML html={this.state.html} renderers={this.renderers} imagesMaxWidth={Dimensions.get('window').width} />
                                </ScrollView>
                            </View>)
                            : (<Spinner color='blue' />)
                        }
                    </Content>
                </Container>
            </Drawer>
        );
    }
}
const styles = StyleSheet.create({
    main: {
        padding: 16,
    },
    titleArea: {
        flex: 1,
        justifyContent: 'center',
        fontFamily: 'Montserrat Medium'
    },
    imgBg: {
        height: 200,
        width: '100%',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        fontFamily: 'Montserrat'
    },
    titleDesc: {
        textAlign: 'center',
        fontFamily: 'Montserrat'
    }
});

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
    mainOverlay: { backgroundColor: '#000000', opacity: 0 }
}