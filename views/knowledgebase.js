import React from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Toast, Left, Body, View, Spinner } from 'native-base';
import Drawer from 'react-native-drawer';
import I18n from '../js/i18n';
import Rest from '../js/rest';
import Sidebar from '../components/sidebar';
import KbItemCard from '../components/kbitemcard';

export default class KnowledgeBaseScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kb: [],
            loaded: false,
            text: '',
            index: 0,
            searchIndex: 0,
            end: false,
            busy: false,
            error: '',
            refreshing: false
        };
    }

    componentDidMount() {
        this.getInfoPropular();
    }

    showMsg() {
        Toast.show({
            text: 'You pressed the icon',
            buttonText: 'Okay',
            duration: 3000
        });
    }

    getInfoPropular() {
        if (!this.state.end && !this.state.busy) {
            this.setState({ busy: true });
            Rest.getInfoPopular(this.state.index, 5).then((result) => {
                this.setState({ kb: [...this.state.kb, ...result], loaded: true, index: this.state.index + 1, busy: false, refreshing: false });
                if (result == null || result.length == 0) {
                    this.setState({ end: true });
                }
            }).catch((error) => {
                this.setState({ error: I18n.t('error') });
                console.error(error);
            });
        }
    }

    search() {
        if (this.state.text != '') {
            if (this.state.searchIndex == 0) {
                this.setState({ kb: [], loaded: false, end: false });
            }
            if (!this.state.end && !this.state.busy) {
                this.setState({ busy: true });
                Rest.getSearchItem(this.state.text, this.state.searchIndex, 10).then((result) => {
                    this.setState({ kb: [...this.state.kb, ...result], loaded: true, searchIndex: this.state.searchIndex + 1, busy: false, refreshing: false });
                    if (result == null || result.length == 0) {
                        this.setState({ end: true });
                    }
                }).catch((error) => {
                    this.setState({ error: I18n.t('error') });
                    console.error(error);
                });
            }
        }
    }

    refresh() {
        this.setState({ kb: [], loaded: false, end: false, index: 0, searchIndex: 0, refreshing: true }, this.loadMore);
    }

    loadMore() {
        // console.log({
        //         loaded: this.state.loaded,
        //         text: this.state.text,
        //         index: this.state.index,
        //         searchIndex: this.state.searchIndex,
        //         end: this.state.end,
        //         busy: this.state.busy
        // });
        if (this.state.text == '') {
            console.log('22');
            this.getInfoPropular();
        } else {
            console.log('33');
            this.search();
        }
    }

    closeDrawer = () => {
        this.drawer.close();
    };
    openDrawer = () => {
        this.drawer.open();
    };

    render() {
        return (
            <Drawer
                ref={(ref) => this.drawer = ref}
                content={<Sidebar navigation={this.props.navigation} />}
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
                {this.state.error != ''
                    ? (
                        <View style={styles.container}>
                            <Text style={styles.text}>{this.state.error}</Text>
                        </View>)
                    : (
                        <Container>
                            <Header searchBar rounded>
                                <Item>
                                    <Icon name='ios-search' />
                                    <Input
                                        placeholder='Search'
                                        returnKeyType='search'
                                        onSubmitEditing={this.search.bind(this)}
                                        onChangeText={(text) => this.setState({ text })}
                                        value={this.state.text} />
                                    <Icon name='menu' onPress={this.openDrawer} />
                                </Item>
                                <Button transparent>
                                    <Text>{I18n.t('search')}</Text>
                                </Button>
                            </Header>
                            {this.state.loaded
                                ? (<FlatList
                                    data={this.state.kb}
                                    onRefresh={this.refresh.bind(this)}
                                    refreshing={this.state.refreshing}
                                    ListFooterComponent={this.state.end &&
                                        <Text style={styles.text}>{I18n.t('NoMoreContent')}</Text>
                                    }
                                    renderItem={({ item }) => <KbItemCard navigation={this.props.navigation} item={item} />}
                                    onEndReached={this.loadMore.bind(this)} />)
                                : (<Spinner color='blue' />)
                            }
                        </Container>)
                }
            </Drawer>
        );
    }
}

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
    mainOverlay: { backgroundColor: '#000000', opacity: 0 }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});