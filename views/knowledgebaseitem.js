import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import Drawer from 'react-native-drawer';
import I18n from '../js/i18n';
import Rest from '../js/rest';
import Sidebar from '../components/sidebar';

export default class KnowledgebaseItemScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemId: 0
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const itemId = navigation.getParam('itemId', 0);
        this.setState({itemId: itemId});
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
                </Container>
            </Drawer>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    hello: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
    mainOverlay: { backgroundColor: '#000000', opacity: 0 }
}