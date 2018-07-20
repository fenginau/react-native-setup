import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Content, Text, Accordion, List, ListItem, Left, Right, Icon, View } from 'native-base';
import Rest from '../js/rest';

export default class KbSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            expanded: null,
            loaded: false
        };
        this.getMenu();
    }

    getMenu() {
        Rest.getKbMenu().then((result) => {
            this.buildMenu(result);
        }).catch((error) => {
            console.error(error);
        });
    }

    buildMenu(rawMenu) {
        var menu = [];
        var subIndex = -1;
        if (rawMenu.length > 0) {
            // sort the raw data first
            rawMenu.sort((x, y) => {
                var n = x.subId - y.subId;
                if (n != 0) {
                    return n;
                }
                n = x.level - y.level;
                if (n != 0) {
                    return n;
                }
                return (x.title < y.title ? -1 : (x.title > y.title ? 1 : 0));
            });

            // build the menu list
            var subId = 0;
            var tempSub = null;
            var tempList = [];
            var list;
            rawMenu.forEach(e => {
                if (e.level == 0) {
                    if (tempSub != null) {
                        if (tempList.length > 0) {
                            tempSub.content = [...tempList];
                            tempList = [];
                        } else {
                            tempSub.content = [];
                        }
                        menu.push(tempSub);
                    }
                    tempSub = { title: e.title, content: [] };
                    subIndex++;
                }
                if (e.itemId == this.props.item && e.itemId > 0) {
                    this.setState({ expanded: subIndex });
                    e.selected = true;
                } else {
                    e.selected = false;
                }
                if (e.itemId > 0){
                    tempList.push(e);
                }
            });
            if (tempList.length > 0) {
                tempSub.content = [...tempList];
                tempList = [];
                menu.push(tempSub);
            }
        }
        this.setState({ menu: menu, loaded: true });
    }

    createNavList(listItems, navigation) {
        return (
            <List dataArray={listItems}
                renderRow={(item) =>
                    <ListItem selected={item.selected}
                        onPress={() => navigation.push('KnowledgeItem', {
                            itemId: item.itemId
                        })}>
                        <Left>
                            <Text>{item.title}</Text>
                        </Left>
                        <Right>
                            <Icon name="arrow-forward" />
                        </Right>
                    </ListItem>
                }>
            </List>
        );
    }

    render() {
        if (this.state.loaded) {
            return (
                <Content padder>
                    <Accordion
                        ref={(ref) => this.accordion = ref}
                        dataArray={this.state.menu}
                        renderContent={(content) => this.createNavList(content, this.props.navigation)}
                        expanded={this.state.expanded}
                        headerStyle={styles.AccordionHeader}
                        contentStyle={styles.AccordionContent}
                        style={styles.Accordion} />
                </Content>
            );
        } else {
            return (<View><Text>Loading...</Text></View>);
        }
    }
}

const styles = StyleSheet.create({
    Accordion: { borderWidth: 0, },
    AccordionHeader: { margin: 5, backgroundColor: '#ececec' },
    AccordionContent: { backgroundColor: '#fafafa', paddingLeft: 20, paddingRight: 20, },
});