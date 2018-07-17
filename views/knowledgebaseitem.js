import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.hello}>This is knowledgebase item {this.state.itemId}</Text>
            </View>
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