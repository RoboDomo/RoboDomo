import React from 'react'
import renderer from 'react-test-renderer'

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import MQTT from './MQTT'

import {
    indigo500, indigo700, redA200,
    grey400, pinkA200, grey100, grey500, darkBlack, white, grey300, cyan500, fullBlack
} from 'material-ui/styles/colors'

const muiTheme = getMuiTheme(Object.assign({}, baseTheme, {
    palette: {
        primary1Color:     indigo500,
        primary2Color:     indigo700,
        accent1Color:      redA200,
        pickerHeaderColor: indigo500
        // primary3Color:      grey400,
        // accent1Color:       pinkA200,
        // accent2Color:       grey100,
        // accent3Color:       grey500,
        // textColor:          darkBlack,
        // alternateTextColor: white,
        // canvasColor:        white,
        // borderColor:        grey300,
        // pickerHeaderColor:  cyan500,
        // shadowColor:        fullBlack,
    }
}))

test('snapshot', () => {
    const component = renderer.create(
        <MuiThemeProvider muiTheme={muiTheme}>
            <MQTT
                dirty={() => {}}
            />
        </MuiThemeProvider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
})
