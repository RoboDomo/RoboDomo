import Config from '../../Config'

import React from 'react'

import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'

import Dashboard from '../controls/Dashboard'

/**
 *
 */
export default class DashboardScreen extends React.Component {
  constructor(props) {
    super(props)
    this.defaults  = Config.dashboards.defaults
    this.changeTab = this.changeTab.bind(this)
    this.state     = {
      activeTab: localStorage.getItem('dashboardTabState') || '0'
    }
  }

  render() {
    return (
      <Tabs
        style={{marginTop: 2}}
        activeKey={this.state.activeTab}
        bsStyle="pills"
        id="dashboard-tabs"
        onSelect={this.changeTab}
        mountOnEnter
        unmountOnExit
      >
        {Config.dashboards.boards.map((board) => {
          const tiles = board.tiles

          return (
            <Tab
              style={{amrginTop: 10}}
              eventKey={board.key}
              key={board.key}
              title={board.title}
            >
              <Dashboard
                tiles={tiles}
              />
            </Tab>
          )
        })}
      </Tabs>
    )
  }

  changeTab(eventKey) {
    localStorage.setItem('dashboardTabState', eventKey)
    this.setState({activeTab: eventKey})
  }
}
