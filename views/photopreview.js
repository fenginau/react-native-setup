import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
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

    render() {
        if (this.state.loaded) {
            return (
                <View style={styles.container}>
                    <Image source={{uri: `data:image/jpg;base64,${this.state.image.base64}`}} style={{width:'100%', height:'100%'}} />
                </View>
            );
        } 
        else 
        {
            return (<Spinner color='blue' />);
        }
        
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});