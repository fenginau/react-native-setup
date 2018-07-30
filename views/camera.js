import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import { RNCamera } from 'react-native-camera'

export default class CameraScreen extends React.Component {
    render() {
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
                        <Icon style={{fontSize: 60, color: 'white'}} name='ios-camera' />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    takePicture = async function () {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            this.camera.takePictureAsync(options).then(data => {
                this.props.navigation.push('PhotoPreview', { image: data });
                // console.log(data);
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
        margin: 20
    }
});