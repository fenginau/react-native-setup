import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { Spinner } from 'native-base';

export default class PhotoPreviewScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            loaded: false
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const image = navigation.getParam('image', '');
        this.setState({ image: image, loaded: true });
    }

    proceedPic() {
        console.log('yes');
    }

    retakePic() {
        console.log('no');
    }

    render() {
        if (this.state.loaded) {
            return (
                <Container style={styles.container}>
                    <Image source={{uri: this.state.image.uri}} style={{ width: '100%', height: '100%' }} />

                    {/* <Image source={{ uri: `data:image/jpg;base64,${this.state.image.base64}` }} style={{ width: '100%', height: '100%' }} /> */}
                    <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%' }}>
                        <View style={{ flex: 0.5 }}>
                            <TouchableOpacity
                                onPress={this.retakePic.bind(this)}
                                style={styles.button}>
                                <Text style={styles.text}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <TouchableOpacity
                                onPress={this.proceedPic.bind(this)}
                                style={styles.button}>
                                <Text style={styles.text}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Container>
            );
        }
        else {
            return (<Spinner color='blue' />);
        }

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        flex: 0,
        alignSelf: 'center',
        margin: 20
    },
    text: {
        fontSize: 20,
        color: 'white'
    }
});