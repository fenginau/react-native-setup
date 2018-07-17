import React from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Toast, Left, Body, View } from 'native-base';
import Drawer from 'react-native-drawer';
import I18n from '../js/i18n';
import Rest from '../js/rest';
import Sidebar from '../components/sidebar';
import KbItemCard from '../components/kbitemcard';

export default class KnowledgeBaseScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kbPopular: []
        };
    }

    componentDidMount() {
        console.log(typeof this.props.navigation);
        this.getKbPropular();
    }

    showMsg() {
        Toast.show({
            text: "You pressed the icon",
            buttonText: "Okay",
            duration: 3000
        });
    }

    getKbPropular() {
        Rest.getKbPopular(0, 10).then((result) => {
            this.setState({ kbPopular: result })
        }).catch((error) => {
            console.error(error);
        });
    }

    closeDrawer = () => {
        this.drawer.close()
    };
    openDrawer = () => {
        this.drawer.open()
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
                styles={styles.drawer}
                panCloseMask={0.2}
                captureGestures={true}
                negotiatePan={true}
                tweenHandler={(ratio) => ({ main: { opacity: (2 - ratio) / 2 } })}>
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
                    <FlatList
                        data={this.state.kbPopular}
                        renderItem={({ item }) => <KbItemCard item={item} />}
                    />
                </Container>
            </Drawer>
        );
    }
}
var styles = StyleSheet.create({
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
});