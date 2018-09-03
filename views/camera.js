import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Container, Spinner } from 'native-base';
import { Icon } from 'native-base';
import { RNCamera } from 'react-native-camera';
import I18n from '../js/i18n';

export default class CameraScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            done: false,
            showSpinner: false
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        const item = navigation.getParam('item', '');
        this.setState({ item });
    }

    proceedPic() {
        const { navigation } = this.props;
        navigation.state.params.returnData(this.state.item, this.state.image.uri);
        navigation.goBack();
    }

    retakePic() {
        this.setState({image: null, done: false, showSpinner: false});
    }
    
    render() {
        if (this.state.done) {
            return (
                <Container style={styles.container}>
                    <Image source={{ uri: this.state.image.uri }} style={{ width: '100%', height: '100%' }} />
                    <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%' }}>
                        <View style={{ flex: 0.5 }}>
                            <TouchableOpacity
                                onPress={this.retakePic.bind(this)}
                                style={styles.button}>
                                <Text style={styles.text}>{I18n.t('Retry')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <TouchableOpacity
                                onPress={this.proceedPic.bind(this)}
                                style={styles.button}>
                                <Text style={styles.text}>{I18n.t('OK')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Container>
            );
        } else {
            return (
                <View style={styles.container}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.on}
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your camera phone'}
                    />
                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, width: '100%' }}>
                        <TouchableOpacity
                            onPress={this.takePicture.bind(this)}
                            style={styles.capture}>
                            <Icon style={{ fontSize: 60, color: 'grey' }} name='ios-camera' />
                        </TouchableOpacity>
                    </View>
                    {this.state.showSpinner &&
                        <View style={styles.overlaySpinner}>
                            <Spinner color='blue' />
                        </View>}
                </View>
            );
        }
    }

    takePicture = async function () {
        this.setState({showSpinner: true});
        if (this.camera) {
            const options = { quality: 0.5, base64: false, fixOrientation: true, forceUpOrientation: true };
            this.camera.takePictureAsync(options).then(data => {
                this.setState({image: data, done: true, showSpinner: false});
                //this.props.navigation.push('PhotoPreview', { image: data });
            });
        }
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        alignSelf: 'center',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 45,
        height: 90,
        width: 90,
        alignItems: 'center',
        justifyContent: 'center'
    },
    overlaySpinner: { 
        flex: 1, 
        justifyContent: 'center', 
        position: 'absolute', 
        top: 0, 
        width: '100%', 
        height: Dimensions.get('window').height, 
        backgroundColor: 'rgba(255, 255, 255, 0.4)' 
    },
    button: {
        flex: 0,
        alignSelf: 'center',
        margin: 20
    },
    text: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    }
});