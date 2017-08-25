// SideNav

import Config from '../../Config'
import React from 'react'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'

const skip = [
    'notFound',
    'dashboard'
]
export default class SideNav extends React.Component {
    render() {
        if (Config.screenSize === 'small') {
            return null
        }
        const routes = Config.routes,
              hash   = location.hash.replace('#', '')
        
        return (
            <ListGroup>
                {Object.keys(routes).map((path) => {
                    const route    = routes[path],
                          listItem = ~skip.indexOf(path) ? null : (
                              <ListGroupItem
                                  key={path}
                                  href={`#${path}`}
                                  active={hash === path}
                              >
                                  {route.text}
                              </ListGroupItem>
                          )
                    return listItem
                })}
            </ListGroup>
        )
        
    }
}

