import React from 'react';
import { StyleSheet, Keyboard } from 'react-native';
import { Container, Header, List, ListItem, Item, Input, Icon, Button, Text, Toast, Left, Body, View, Spinner, Right, Title } from 'native-base';
import realm from '../js/realm';
import I18n from '../js/i18n';
import Color from '../js/color';

export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            search: { subjects: ['Math', 'English', 'Piano', 'Chinese'] },
            refine: false,
            title: '',
            subjects: []
        };
    }

    componentDidMount() {
        this.buildTitle();
        let subjects = ['Math', 'English', 'Physics', 'Chinese', 'Piano'];
        this.setState({ subjects: subjects });
    }

    search() {
        console.log('search submitted');
    }

    buildTitle() {
        let subArray = this.state.search.subjects;
        let length = subArray.length;
        this.setState({ title: length > 1 ? `${subArray[0]} & ${length - 1} more...` : subArray[0] });
    }

    subjectClick(item) {
        if (!this.state.search.subjects.includes(item)) {
            let search = { ...this.state.search };
            search.subjects = [...this.state.search.subjects, item];
            let text = `${this.state.text}${this.state.text != '' ? ', ' : ''}${item}`;
            this.setState({ text, search }, () => {
                this.buildTitle();
            });
        }
    }

    disactiveSearch() {
        this.setState({ refine: false });
        Keyboard.dismiss();
    }

    goback() {
        console.log('go back');
    }

    refine() {
        this.setState({ refine: true, text: this.state.search.subjects.join(',') });
    }

    refineSubject() {
        this.setState({ refine: false });
    }

    render() {
        return (
            <Container>
                {this.state.refine
                    ? (<Header searchBar rounded>
                        <Item>
                            {this.state.refine
                                ? <Icon name='md-arrow-round-back' onPress={this.disactiveSearch.bind(this)} />
                                : <Icon name='ios-search' />}
                            <Input
                                placeholder='Search'
                                returnKeyType='search'
                                onSubmitEditing={this.search.bind(this)}
                                onChangeText={(text) => this.setState({ text })}
                                value={this.state.text} />
                            <Icon name='md-checkmark' onPress={this.refineSubject.bind(this)} />
                        </Item>
                        <Button transparent>
                            <Text>{I18n.t('search')}</Text>
                        </Button>
                    </Header>)
                    : (<Header>
                        <Left>
                            <Button transparent onPress={this.goback.bind(this)}>
                                <Icon name='md-arrow-round-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>{this.state.title}</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.refine.bind(this)}>
                                <Icon name='ios-search' />
                            </Button>
                        </Right>
                    </Header>)}
                {this.state.refine
                    ? <View>
                        <Text style={styles.title}>{I18n.t('subjectSearch')}</Text>
                        <List dataArray={this.state.subjects}
                            renderRow={(item) =>
                                <ListItem button onPress={this.subjectClick.bind(this, item)} style={styles.row}>
                                    <Icon style={styles.listIcon} name='ios-search' />
                                    <Text>{item}</Text>
                                </ListItem>}>
                        </List>
                        <Button full primary transparent onPress={this.refineSubject.bind(this)}>
                            <Text>Done</Text>
                        </Button>
                    </View>
                    : <View>
                        <Text style={styles.title}>{I18n.t('searchHistory')}</Text>

                    </View>}
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    listIcon: {
        fontSize: 24,
        color: Color.LightGrey,
        marginLeft: 10,
        marginRight: 10
    },
    title: {
        fontSize: 18,
        textAlign: 'left',
        margin: 10,
        color: Color.Grey
    },
    row: {
        flexDirection: 'row',
        flex: 1
    }
});