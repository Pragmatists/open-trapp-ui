import React, { Component } from 'react';
import { Tab } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';

interface TabBarState {
  selectedTab: any;
}

export class TabBar extends Component<{}, TabBarState> {
  render() {
    return (
      <Tabs
        value={this.state.selectedTab}
        onChange={this.handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Registration" />
        <Tab label="Reporting" />
        <Tab label="Settings" />
      </Tabs>
    );
  }

  private handleChange = (event, value) => {};
}
