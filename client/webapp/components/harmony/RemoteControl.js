// Harmony Remote Control

import Config from '../../../Config'

import React, {Component} from 'react'

import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import Joystick from '../../../common/Joystick'
import NumberPad from '../../../common/NumberPad'
import AudioControls from '../denon/AudioControls'

import MQTTButton from '../../../common/MQTTButton'
import FanButton from './FanButton'
import DimmerButton from './DimmerButton'
import Thermostat from './Thermostat'

// space between control groups
const SPACE = 10

export default class RemoteControl extends Component {
  constructor(props) {
    super(props)
    this.topic            = this.props.topic
    this.denon            = this.props.denon
    this.buttons          = this.props.buttons
    this.renderPlainButton= props.renderPlainButton
    this.controlGroup     = props.controlGroup
    this.renderButton     = props.renderButton
    this.renderMiniButton = props.renderMiniButton
  }

  /**
     * Dynamically generate navigation (back, Live TV, TiVo, etc.) buttons
     * @returns {XML}
     */
  renderNavigation() {
    const me           = this,
          controlGroup = this.controlGroup

    function renderBack() {
      if (controlGroup.NavigationExtended && controlGroup.NavigationExtended.function.Clear) {
        return me.renderButton('Clear')
      }
      return null
    }

    function renderLiveTV() {
      if (controlGroup.NavigationDSTB && controlGroup.NavigationDSTB.function.Live) {
        return me.renderButton('Live', 'Live TV')
      }
      else if (controlGroup.NavigationExtended && controlGroup.NavigationExtended.function.Exit) {
        return me.renderButton('Exit')
      }
      return null
    }

    function renderSettings() {
      if (controlGroup.GoogleTVNavigation && controlGroup.GoogleTVNavigation.function.Settings) {
        return me.renderButton('Settings')
      }
      else if (controlGroup.Setup && controlGroup.Setup.function.Setup) {
        return me.renderButton('Setup')
      }
      return null
    }

    function renderTiVo() {
      if (controlGroup.TiVo) {
        return me.renderButton('TiVo', 'TiVo', 'primary')
      }
      else if (controlGroup.GameType3 && controlGroup.GameType3.function.Home) {
        return me.renderButton('Home', 'Home', 'primary')
      }
      else if (controlGroup.Miscellaneous && controlGroup.Miscellaneous.function.Home) {
        return me.renderButton('Home', 'Home', 'primary')
      }
      return null
    }


    function renderGuide() {
      if (controlGroup.NavigationExtended && controlGroup.NavigationExtended.function.Guide) {
        return me.renderButton('Guide')
      }
      else if (controlGroup.NavigationExtended && controlGroup.NavigationExtended.function.XboxGuide) {
        return me.renderButton('XboxGuide', 'Guide')
      }
      return null
    }

    function renderInfo() {
      if (controlGroup.NavigationExtended && controlGroup.NavigationExtended.function.Info) {
        return me.renderButton('Info')
      }
      return null
    }

    return (
      <div style={{textAlign: 'center'}}>
        <ButtonGroup>
          {renderBack()}
          {renderLiveTV()}
          {renderSettings()}
          {renderTiVo()}
          {renderGuide()}
          {renderInfo()}
        </ButtonGroup>
      </div>
    )
  }

  renderInputs() {
    const misc = this.controlGroup.Miscellaneous

    if (!misc) {
      return null
    }
    const f       = misc.function,
          options = []

    for (const key of Object.keys(f)) {
      if (key.startsWith('Input') && !key.startsWith('InputMode')) {
        options.push(key)
      }
    }

    if (options.length) {
      return (
        <DropdownButton
          id={'split-button-inputs'}
          title="Inputs"
          bsStyle="default"
        >
          {options.map((option, ndx) => {
            return (
              <MenuItem
                key={ndx}
                eventKey={ndx}
              >
                {option}
              </MenuItem>
            )
          })}
        </DropdownButton>
      )
    }
    return null
  }

  renderThumbsUpThumbsDown() {
    const controlGroup = this.controlGroup

    if (controlGroup.TiVo) {
      return (
        <div style={{marginTop: SPACE, textAlign: 'center'}}>
          <ButtonGroup>
            {this.renderButton('ThumbsUp', <Glyphicon glyph="thumbs-up"/>, 'success')}
            {this.renderButton('ThumbsDown', <Glyphicon glyph="thumbs-down"/>, 'danger')}
          </ButtonGroup>
        </div>
      )
    }
    else if (controlGroup.GameType1) {
      return (
        <div style={{marginTop: SPACE, textAlign: 'center'}}>
          <ButtonGroup>
            {this.renderButton('GameA', 'A')}
            {this.renderButton('GameB', 'B')}
            {this.renderButton('GameX', 'X')}
            {this.renderButton('GameY', 'Y')}
          </ButtonGroup>
        </div>
      )
    }
    return null
  }

  renderNumberpad() {
    const controlGroup = this.controlGroup.NumericBasic

    if (!controlGroup) {
      return null
    }

    return (
      <div style={{marginTop: SPACE, textAlign: 'center'}}>
        <NumberPad
          renderButton={this.renderButton}
          buttons={{
            '0':     {command: 'Number0', display: '0',},
            '1':     {command: 'Number1', display: '1',},
            '2':     {command: 'Number2', display: '2',},
            '3':     {command: 'Number3', display: '3',},
            '4':     {command: 'Number4', display: '4',},
            '5':     {command: 'Number5', display: '5',},
            '6':     {command: 'Number6', display: '6',},
            '7':     {command: 'Number7', display: '7',},
            '8':     {command: 'Number8', display: '8',},
            '9':     {command: 'Number9', display: '9',},
            'dot':   {command: 'Dot', display: '.',},
            'enter': {command: 'NumberEnter', display: 'Enter',},
          }}
        />
      </div>
    )
  }

  renderJoystick() {
    const controlGroup = this.controlGroup

    if (!controlGroup || !controlGroup.NavigationBasic) {
      return null
    }

    const channel  = controlGroup.Channel,
          pageUp   = channel ? 'ChannelUp' : undefined,
          pageDown = channel ? 'ChannelDown' : undefined

    return (
      <div style={{marginTop: SPACE, textAlign: 'center'}}>
        <Joystick
          renderButton={this.renderButton}
          up="DirectionUp"
          down="DirectionDown"
          left="DirectionLeft"
          right="DirectionRight"
          select="Select"
          pageUp={pageUp}
          pageDown={pageDown}
        />
      </div>
    )
  }

  renderABCD() {
    const controlGroup = this.controlGroup

    if (controlGroup.NavigationDSTB && controlGroup.NavigationDSTB.function.A) {
      return (
        <div style={{marginTop: SPACE, textAlign: 'center'}}>
          <ButtonGroup>
            {this.renderButton('A', 'A', 'warning')}
            {this.renderButton('B', 'B', 'primary')}
            {this.renderButton('C', 'C', 'danger')}
            {this.renderButton('D', 'D', 'success')}
          </ButtonGroup>
        </div>
      )
    }
    else if (controlGroup.ColoredButtons) {
      return (
        <div style={{marginTop: SPACE, textAlign: 'center'}}>
          <ButtonGroup>
            {this.renderButton('Green', 'Green', 'success')}
            {this.renderButton('Red', 'Red', 'danger')}
            {this.renderButton('Blue', 'Blue', 'primary')}
            {this.renderButton('Yellow', 'Yellow', 'warning')}
          </ButtonGroup>
        </div>
      )
    }

    return null
  }

  xrenderPlaybackControls() {
    const controlGroup = this.controlGroup

    const recordButton = controlGroup.TransportRecording ? this.renderPlainButton('Record', 
      <Glyphicon
        glyph="record"
      />, 'danger') : null

    return (
      <div style={{position: 'fixed', left: 0, bottom: 0, width: '100%'}}>
        <ButtonGroup justified>
          {this.renderPlainButton('SkipBackward', <Glyphicon glyph="fast-backward"/>)}
          {this.renderPlainButton('Rewind', <Glyphicon glyph="backward"/>)}
          {this.renderPlainButton('Pause', <Glyphicon glyph="pause"/>)}
          {this.renderPlainButton('Play', <Glyphicon glyph="play"/>)}
          {this.renderPlainButton('FrameAdvance', <Glyphicon glyph="step-forward"/>)}
          {this.renderPlainButton('FastForward', <Glyphicon glyph="forward"/>)}
          {this.renderPlainButton('SkipForward', <Glyphicon glyph="fast-forward"/>)}
          {recordButton}
        </ButtonGroup>
      </div>
    )
  }
  renderPlaybackControls() {
    const controlGroup = this.controlGroup

    const recordButton = controlGroup.TransportRecording ? this.renderMiniButton('Record', 
      <Glyphicon
        glyph="record"
      />, 'danger') : null

    return (
      <div style={{marginTop: SPACE, textAlign: 'center'}}>
        <ButtonGroup>
          {this.renderMiniButton('SkipBackward', <Glyphicon glyph="fast-backward"/>)}
          {this.renderMiniButton('Rewind', <Glyphicon glyph="backward"/>)}
          {this.renderMiniButton('Pause', <Glyphicon glyph="pause"/>)}
          {this.renderMiniButton('Play', <Glyphicon glyph="play"/>)}
          {this.renderMiniButton('FrameAdvance', <Glyphicon glyph="step-forward"/>)}
          {this.renderMiniButton('FastForward', <Glyphicon glyph="forward"/>)}
          {this.renderMiniButton('SkipForward', <Glyphicon glyph="fast-forward"/>)}
          {recordButton}
        </ButtonGroup>
      </div>
    )
  }

  /**
     * This is just a dump of the activity's (or device's) controlGroup
     *
     * @returns {XML}
     */
  renderDetail() {
    const controlGroup = this.controlGroup

    return null
    return (
      <ListGroup>
        {Object.keys(controlGroup).map((groupKey) => {
          const group = controlGroup[groupKey],
                key   = 'control-group-' + group.name

          return (
            <ListGroupItem
              header={group.name}
              key={key}
            >
              {Object.keys(group.function).map((funcKey) => {
                const func = group.function[funcKey],
                      key  = 'control-group-' + group.name + '-' + func.name
                return (
                  <span
                    style={{paddingRight: 10}}
                    key={key}
                  >
                    {func.label}
                  </span>
                )
              })}
            </ListGroupItem>
          )
        })}
      </ListGroup>
    )
  }

  renderAudioControls() {
    const controlGroup = this.controlGroup

    if (this.denon) {
      return (
        <AudioControls 
          device={this.denon}
        />
      )
    }
    if (!controlGroup.Volume) {
      return null
    }

    if (Config.screenSize === 'small') {
      return (
        <div style={{textAlign: 'center'}}>
          <ButtonGroup>
            {this.renderButton('Mute', <Glyphicon glyph="volume-off"/>)}
            {this.renderButton('VolumeUp', <Glyphicon glyph="volume-up"/>)}
            {this.renderButton('VolumeDown', <Glyphicon glyph="volume-down"/>)}
          </ButtonGroup>
        </div>
      )
    }

    return (
      <div style={{marginTop: SPACE}}>
        <ButtonGroup vertical>
          {this.renderButton('VolumeUp', <Glyphicon glyph="volume-up"/>)}
          {this.renderButton('VolumeDown', <Glyphicon glyph="volume-down"/>)}
          {this.renderButton('Mute', <Glyphicon glyph="volume-off"/>)}
        </ButtonGroup>
      </div>
    )
  }

  renderPower() {
    const controlGroup = this.controlGroup
    if (!controlGroup.Power) {
      return null
    }

    const f      = controlGroup.Power.function,
          on     = f.PowerOn ? this.renderButton('PowerOn', <Glyphicon glyph="off"/>, 'success') : null,
          off    = f.PowerOff ? this.renderButton('PowerOff', <Glyphicon glyph="off"/>, 'danger') : null,
          toggle = f.PowerOn ? this.renderButton('PowerToggle', <Glyphicon glyph="off"/>) : null


    return (
      <div>
        <ButtonGroup vertical>
          {off}
          {on}
          {toggle}
        </ButtonGroup>
      </div>
    )
  }

  renderDvd() {
    const controlGroup = this.controlGroup

    if (!controlGroup.NavigationDVD) {
      return null
    }

    const f        = controlGroup.NavigationDVD.function,
          back     = f.Back ? this.renderButton('Back') : null,
          menu     = f.Menu ? this.renderButton('Menu') : null,
          retrn    = f.Return ? this.renderButton('return') : null,
          subtitle = f.Subtitle ? this.renderButton('Subtitle', <Glyphicon glyph="subtitles"/>) : null,
          eject    = controlGroup.TransportBasic.function.Eject ? this.renderButton('Eject', <Glyphicon
            glyph="eject"
                                                                                             />) : null,
          favorite = controlGroup.TransportBasic.function.Favorite ? this.renderButton('Favorite') : null,
          options  = controlGroup.Program && controlGroup.Program.function.Options ? this.renderButton('Options') : null,
          search   = controlGroup.NavigationDSTB && controlGroup.NavigationDSTB.function.Search ? this.renderButton('Search') : null,
          settings = controlGroup.Miscellaneous && controlGroup.Miscellaneous.function.Settings ? this.renderButton('Settings') : null

    return (
      <div style={{marginBottom: SPACE}}>
        <ButtonGroup vertical>
          {settings}
          {back}
          {retrn}
          {menu}
          {search}
          {options}
          {favorite}
          {subtitle}
          {eject}
        </ButtonGroup>
      </div>
    )
  }

  renderButtons() {
    const buttons = this.buttons || []

    return (
      <div>
        {buttons.map((button, ndx) => {
          const key = String(ndx)
          switch (button.type) {
            case 'mqtt':
              return (
                <MQTTButton
                  key={key}
                  topic={button.topic}
                  value={button.message}
                >
                  {button.text}
                </MQTTButton>
              )
            case 'fan':
              return (
                <div key={key} style={{marginTop: 8}}>
                  {button.text}
                  <FanButton
                    name={button.name}
                  />
                </div>
              )
            case 'dimmer':
              return (
                <div key={key} style={{marginTop: 8}}>
                  {button.text}
                  <DimmerButton
                    name={button.name}
                  />
                </div>
              )
            case 'thermostat':
              return (
                <div key={key} style={{marginTop: 8}}>
                  {button.text}
                  <Thermostat
                    text={button.text}
                    name={button.name}
                  />
                </div>
              )
          }
          return null
        })}
      </div>
    )
  }

  render() {
    if (Config.screenSize === 'small') {
      return (
        <div style={{marginBottom: 30}}>
          {this.renderPower()}
          {this.renderDvd()}
          {this.renderAudioControls()}
          {this.renderNavigation()}
          {this.renderInputs()}
          {this.renderThumbsUpThumbsDown()}
          {this.renderABCD()}
          {this.renderJoystick()}
          {this.renderNumberpad()}
          {this.renderPlaybackControls()}
          {/*{this.renderDetail()}*/}
        </div>
      )
    }
    return (
      <Row> 
        <Col sm={2}>
          {this.renderAudioControls()}
        </Col>
        <Col sm={8}>
          {this.renderNavigation()}
          {this.renderInputs()}
          {this.renderThumbsUpThumbsDown()}
          {this.renderABCD()}
          {this.renderJoystick()}
          {this.renderNumberpad()}
          {this.renderPlaybackControls()}
          {this.renderDetail()}
        </Col>
        <Col sm={2}>
          {this.renderPower()}
          {this.renderDvd()}
          {this.renderButtons()}
        </Col>
      </Row>
    )
  }
}
