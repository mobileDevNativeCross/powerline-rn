
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Item, Input, Grid, Row, Col, Spinner, ListItem, Thumbnail, List } from 'native-base';
import { View, RefreshControl } from 'react-native';
import { loadUserGroups, clearGroupsInCache } from 'PLActions';
import styles from './styles';

const PLColors = require('PLColors');

class GroupSelector extends Component {

    static propTypes = {
        token: React.PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }

    componentWillMount() {
        const { props: { page } } = this;
        if (page === 0) {
            this.loadInitialGroups();
        }
    }

    async loadInitialGroups() {
        this.setState({ isLoading: true });
        const { props: { token, dispatch } } = this;
        try {
            await Promise.race([
                dispatch(loadUserGroups(token)),
                timeout(15000),
            ]);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'Timed out') {
                alert(message);
            }
            else {
                alert('Timed out. Please check internet connection');
            }
            return;
        } finally {
            this.setState({ isLoading: false });
        }
    }

    _onRefresh() {
        this.props.dispatch(clearGroupsInCache());
        this.loadInitialGroups();
    }

    _renderLoading() {
        if (this.state.isLoading == true) {
            return (
                <Spinner color={PLColors.main} />
            );
        } else {
            return null;
        }
    }

    render() {
        const { props: { payload } } = this;
        return (
            <Container style={styles.container}>
                <Header searchBar rounded style={styles.header}>
                    <Left style={{ flex: 0.1 }}>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon active name="arrow-back" style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Item style={styles.searchBar}>
                        <Input style={styles.searchInput} placeholder="Search for groups" />
                        <Icon active name="search" />
                    </Item>
                </Header>

                <Content padder
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }>
                    <ListItem itemHeader first style={{ borderBottomWidth: 0 }}>
                        <Left>
                            <Text style={styles.titleText}>Choose Group</Text>
                        </Left>
                        <Right>
                            <Button small iconLeft transparent style={{ alignSelf: 'flex-end', width: 100 }}>
                                <Icon name="ios-add-circle" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>ADD GROUP</Text>
                            </Button>
                        </Right>
                    </ListItem>
                    <ListItem icon style={{ paddingVertical: 5 }}>
                        <Left>
                            <Button style={styles.iconButton}>
                                <Icon active name="pin" style={styles.icon} />
                            </Button>
                        </Left>
                        <Body>
                            <Text style={styles.cellText}>Town</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon style={{ paddingVertical: 5 }}>
                        <Left>
                            <Button style={styles.iconButton}>
                                <Icon active name="pin" style={styles.icon} />
                            </Button>
                        </Left>
                        <Body>
                            <Text style={styles.cellText}>State</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon style={{ paddingVertical: 5 }}>
                        <Left>
                            <Button style={styles.iconButton}>
                                <Icon active name="pin" style={styles.icon} />
                            </Button>
                        </Left>
                        <Body>
                            <Text style={styles.cellText}>Country</Text>
                        </Body>
                    </ListItem>
                    <List
                        dataArray={payload} renderRow={(group) =>
                            <ListItem avatar style={{ paddingVertical: 5 }}>
                                <Left>
                                    <Thumbnail small source={{ uri: group.avatar_file_path ? group.avatar_file_path : 'https://www.gstatic.com/webp/gallery3/2_webp_a.png' }} style={styles.thumbnail} />
                                </Left>
                                <Body>
                                    <Text style={styles.cellText}>{group.official_name}</Text>
                                </Body>
                            </ListItem>
                        }>
                    </List>
                </Content>
            </Container>
        );
    }
}

async function timeout(ms: number): Promise {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Timed out')), ms);
    });
}

const mapStateToProps = state => ({
    token: state.user.token,
    page: state.groups.page,
    perPage: state.groups.items,
    payload: state.groups.payload,
});


export default connect(mapStateToProps)(GroupSelector);
