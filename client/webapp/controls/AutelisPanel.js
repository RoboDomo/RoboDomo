import Config from '../../Config'

import React, {Component} from 'react'

import Button from 'react-bootstrap/lib/Button'
import request from 'superagent'
import {parseString} from 'xml2js'

export default class AutelisPanel extends Component {
  constructor() {
    super()
    this.timer = null
    this.pending = false
    this.state = {
      text:      [],
      highlight: 15
    }
  }

  format(s) {
    return s
      .replace(/\{/g, '←')
      .replace(/>/g, '→')
      .replace(/\}/g, '→')
      .replace(/\^/g, '↑')
      .replace(/_/g, '↓')
  }
  getDisplay() {
    if (this.pending) {
      return
    }
    this.pending = true
    request
      .get('/poolcontrol/keypad.xml?timestamp=' + Date.now())
      .auth('admin', 'admin')
      .end((err, res) => {
        this.pending = false
        if (err) {
          console.dir(err)
        }
        else {
          parseString(res.text, (err, result) => {
            if (err) {
              console.log('err', err)
              return
            }
            try {
              const lines = [],
                    response = result.response

              if (response === '') {
                return
              }
              lines.push(this.format(response.b0[0]))
              lines.push(this.format(response.b1[0]))
              lines.push(this.format(response.b2[0]))
              lines.push(this.format(response.b3[0]))
              lines.push(this.format(response.b4[0]))
              lines.push(this.format(response.b5[0]))
              lines.push(this.format(response.b6[0]))
              lines.push(this.format(response.b7[0]))
              lines.push(this.format(response.b8[0]))
              lines.push(this.format(response.b9[0]))
              lines.push(this.format(response.b10[0]))
              lines.push(this.format(response.b11[0]))
              this.setState({
                text:      lines,
                highlight: Number(response.hll[0])
              })
            }
            catch (e) {
              console.dir(e)
              console.log('exception', e, result)
            }
          })
        }
      })
  }

  renderButton(text, key) {
    return (
      <Button 
        bsSize="small"
        style={{width: 56, height: 30 }}
        onClick={() => {
          request
            .get('/poolcontrol/keypad.cgi?key=' + key + '&timestamp=' + Date.now())
            .auth('admin', 'admin')
            .end(() => {
              this.getDisplay()
            })
        }}
      >
        {text}
      </Button>
    )
  }
  render() {
    const state = this.state
    let line_number = 0


    return (
      <div>
        <div style={{width: 300, height: 230, padding: '20px 0px 0px 5px', margin: 'auto'}}>
          <div style={{float: 'left', width: 70, height: 200, textAlign: 'center'}}>
            <div style={{marginTop: 10}}>
              {this.renderButton('Pg Up', 3)}
            </div>
            <div style={{paddingTop: 50, paddingBottom: 50}}>
              {this.renderButton('Back', 2)}
            </div>
            <div>
              {this.renderButton('Pg Dn', 1)}
            </div>
          </div>
          <div style={{float: 'left', width: 140, height: 200, margin: '0 5px 0 5px', padding: 2, textAlgn: 'center'}}>
            <div 
              style={{
                fontFamliy:      'Verdana, Arial, sans-serif',
                fontSize:        '13px',
                lineHeight:      '15px',
                marginTop:       5,
                whiteSpace:      'pre',
                backgroundColor: 'white', 
                color:           'black',
                border:          '1px solid black', 
                width:           '100%', 
                height:          '100%',
                textAlign:       'center',
              }}
            >
              {this.state.text.map((line) => {
                if (line_number === state.highlight) {
                  return (
                    <p 
                      key={line_number++}
                      style={{margin: 0, display: 'block', whiteSpace: 'pre', backgroundColor: 'darkgrey', color: 'black'}}
                    >
                      {line.replace(/^\s+/g, '') || ' '}
                    </p>
                  )
                }
                else {
                  return (
                    <p 
                      key={line_number++}
                      style={{margin: 0, display: 'block', whiteSpace: 'pre'}}
                    >
                      {line.replace(/^\s+/g, '') || ' '}
                    </p>
                  )
                }
              })}
            </div>
          </div>
          <div style={{float: 'left', width: 70, height: 200, textAlign: 'center'}}>
            <div style={{marginTop: 10}}>
              {this.renderButton('Up', 6)}
            </div>
            <div style={{marginTop: 130}}>
              {this.renderButton('Dn', 5)}
            </div>
          </div>
        </div>
        <div style={{width: 300, textAlign: 'center', margin: 'auto'}}>
          {this.renderButton('Select', 4)}
        </div>
      </div>
    )
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.timer = null
  }
  componentDidMount() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.getDisplay()
      }, 100)
    }
  }
}

