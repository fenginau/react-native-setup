import React from 'react';
import { Image } from 'react-native';
import { Icon, Button, Text, Card, CardItem, Thumbnail, Left, Body } from 'native-base';
import Rest from '../js/rest';

export default class KbItemCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null
        };
    }
    
    componentDidMount() {
        Rest.getKbTitleImage(this.props.item.headerImageId).then((result) => {
            this.setState({ image: result })
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        return (
            <Card style={{ flex: 0 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={{ uri: 'https://pic3.zhimg.com/50/v2-596d7e85d09d32ac0450a1c778cfa276_hd.jpg' }} />
                        <Body>
                            <Text>{this.props.item.description}</Text>
                            <Text note>April 15, 2016</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <Image source={{ uri: this.state.image }} style={{ height: 200, width: '100%', flex: 1 }} />
                        <Text>
                            {this.props.item.blurb}
                        </Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent textStyle={{ color: '#87838B' }}>
                            <Icon name="logo-github" />
                            <Text>1,926 stars</Text>
                        </Button>
                    </Left>
                </CardItem>
            </Card>
        );
    }
}