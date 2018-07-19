import React from 'react';
import { Content, Text } from 'native-base';
import KbSidebar from './kbsidebar'

export default class Sidebar extends React.Component {
    render() {
        return (
            <Content style={{ backgroundColor: '#FFFFFF' }}>
                <KbSidebar navigation={this.props.navigation} item={this.props.item} />
            </Content>
        );
    }
}