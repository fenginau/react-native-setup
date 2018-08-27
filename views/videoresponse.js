import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Spinner } from 'native-base';
import RNVideo from 'videomodule';
import Rest from '../js/rest';
import I18n from '../js/i18n';
import Global from '../js/global';
import Permission from '../js/permission';

export default class VideoResponseScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            loading: false
        };
    }

    componentDidMount() {
    }

    showVideo() {
        RNVideo.showToast('Call answered', RNVideo.LONG);
        this.setState({loading: true});
        Rest.getTwilioToken().then(result => {
            Permission.requestPermission(
                ['CAMERA', 'RECORD_AUDIO', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']
            ).then(() => {
                this.showVideoActivity(result.data.token);
            });
        });
    }

    showVideoActivity(token) {
        RNVideo.show(token, Global.hardwareId, () => {
            this.setState({loading: false});
        }, (err) => {
            console.log(err);
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.centerChild}>
                    <Text style={styles.textCenter}>{I18n.t('PrepareVideo')}</Text>
                    <Spinner color='blue' />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Button light onPress={this.showVideo.bind(this)}>
                    <Text>Answer</Text>
                </Button>
                <Button danger onPress={() => {
                    RNVideo.showToast('Call rejected', RNVideo.LONG);
                    this.props.navigation.goBack();
                }}>
                    <Text>Reject</Text>
                </Button>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    centerChild: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    textCenter: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});