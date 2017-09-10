// Client configuration settings

import DashboardScreen from './webapp/screens/DashboadScreen'
import ThingsScreen from './webapp/screens/ThingsScreen'
import ThermostatScreen from './webapp/screens/ThermostatScreen'
import AutelisScreen from './webapp/screens/AutelisScreen'
import WeatherScreen from './webapp/screens/WeatherScreen'
import TiVoScreen from './webapp/screens/TiVoScreen'
import LGTVScreen from './webapp/screens/LGTVScreen'
import BraviaScreen from './webapp/screens/BraviaScreen'
import DenonScreen from './webapp/screens/DenonScreen'
import HarmonyScreen from './webapp/screens/HarmonyScreen'
import NotFoundScreen from './webapp/screens/NotFoundScreen'

const lgtvFavorites = [
  'amazon', 'hulu', 'netflix', 'vudu', 'youtube', 'hdmi1', 'hdmi2', 'hdmi3', 'hdmi4'
]

// lowercase these
// if one of the TV's apps contains these strings, it becomes a favorite
const braviaFavorites = [
  'netflix', 'amazon', 'hulu', 'youtube', 'cnn', 'starz', 'hbo go', 'epix', 'showtime anytime', 'fox news', 'cbs'
]

const bowser = require('bowser')

const screenSize = function () {
  if (bowser.ipad) {
    return 'normal'
  }
  return bowser.mobile ? 'small' : 'normal'
}()

export default {
  name:     'RoboDomo Home Automation System',
  version:  '1.0.0',
  location: 'RoboDomo',
  mqtt:     {
    // host is the host running mqtt server
    host:        'ha',
    // port is the port on the mqtt server for websocket connection
    // you would configure this for mosquitto, for example, in mosquitto.conf
    // between host and port, we're looking at something like mqtt://ha:9000
    port:        9000,
    denon:       'denon',
    nest:        'nest',
    weather:     'weather',
    autelis:     'autelis',
    tvguide:     'tvguide',
    harmony:     'harmony',
    tivo:        'tivo',
    bravia:      'bravia',
    lgtv:        'lgtv',
    smartthings: 'smartthings',
    macros:      'macros',
  },
  screenSize: screenSize,
  ui:         {
    panelType:    'primary',
    subPanelType: 'default',
    bsSize:       screenSize === 'small' ? 'small' : 'large',
    // these two add up to 12
    labelCol:     screenSize === 'small' ? 3 : 4,
    fieldCol:     screenSize === 'small' ? 9 : 8,
    // style for remote buttons, denon buttons, etc.
    buttonStyle:  screenSize === 'small' ? {
      width:  56,
      height: 30
    } : {
      width:  100,
      height: 40
    },
    buttonSize:         screenSize === 'small' ? 'small' : null,
    controlButtonStyle: {
      width:  100,
      height: 40
    },
    miniButtonStyle: screenSize === 'small' ? {
      width:  30,
      height: 30
    } : {
      width:  50,
      height: 40
    },
    controlSpace: 20
  },
  routes: {
    dashboard:   {text: 'Dashboard', screen: DashboardScreen},
    things:      {text: 'SmartThings', screen: ThingsScreen},
    thermostat:  {text: 'Thermostat', screen: ThermostatScreen},
    poolcontrol: {text: 'Pool Control', screen: AutelisScreen},
    weather:     {text: 'Weather', screen: WeatherScreen},
    tivo:        {text: 'TiVo', screen: TiVoScreen},
    lgtv:        {text: 'LG TV', screen: LGTVScreen},
    bravia:      {text: 'Sony TV', screen: BraviaScreen},
    denon:       {text: 'Denon AVR', screen: DenonScreen},
    harmony:     {text: 'Harmony Hubs', screen: HarmonyScreen},
    notFound:    {text: 'Not Found', screen: NotFoundScreen},
  },
  dashboards: {
    boards: [
      {
        title: 'Theater',
        key:   'theater',
        tiles: [
          {type: 'clock'},
          {type: 'weather'},
          {type: 'thermostat', device: 'Falsetto/Hallway Thermostat'},
          {type: 'pool'},
          {type: 'spa'},
          {
            type:   'theater',
            denon:  'denon-s910w',
            tv:     'olede6p',
            settop: 'hdmi1',
            tivo:   'tivo-bolt-3tb'
          },
          {
            type:     'smartthings',
            title:    'Theater',
            controls: [
              {device: 'Ceiling Fan', type: 'fan'},
              {device: 'Ceiling Fan Light', type: 'dimmer'},
              {device: 'Kitchen Lights', type: 'dimmer'},
              {device: 'Porch Light', type: 'switch'},
              {device: 'Outside Light', type: 'switch'},
              {device: 'Bathroom Light', type: 'dimmer'},
            ]
          },
          {type: 'macro', name: 'TV Mood', label: 'TV Mood'},
          {type: 'macro', name: 'TV Break', label: 'TV Break'},
          {type: 'macro', name: 'TV Resume', label: 'TV Resume'},
          {type: 'macro', name: 'Theater On', label: 'Theater On'},
          {type: 'macro', name: 'Theater Off', label: 'Theater Off'},
          {type: 'macro', name: 'Bedtime', label: 'Bedtime'},
        ]
      },
      {
        title: 'MBR',
        key:   'mbr',
        tiles: [
          {type: 'clock'},
          {type: 'thermostat', device: 'Falsetto/Hallway Thermostat'},
          {type: 'weather'},
          {type: 'spa'},
          {
            type:     'smartthings',
            title:    'Theater',
            controls: [
              {device: 'Bedroom Fan', type: 'fan'},
              {device: 'Bedroom Light', type: 'dimmer'},
              {device: 'Bathroom Light', type: 'dimmer'},
            ]
          },
          {type: 'macro', name: 'Good Night', label: 'Good Night'},
        ]
      }
    ],
  },
  weather: {
    locations: [
      {name: 'Palm Desert CA', device: '92211'},
      {name: 'Mission Beach CA', device: '92109'}
    ]
  },
  autelis: require('autelis-microservice/config').autelis,
  nest:    {
    thermostats: [
      {device: 'Falsetto/Hallway Thermostat', name: 'Hallway Thermostat'}
    ]
  },
  smartthings: {
    device: 'smartthings',
    name:   'SmartThings Hub',
    things: [
      {name: 'Ceiling Fan Light', type: 'dimmer', rooms: ['Theater']},
      {name: 'Ceiling Fan', type: 'fan', rooms: ['Theater']},
      {name: 'Kitchen Lights', type: 'dimmer', rooms: ['Kitchen', 'Theater']},
      {name: 'Bathroom Light', type: 'dimmer', rooms: ['Bathroom', 'Bedroom']},
      {name: 'Bathroom Sensor', type: 'motion', rooms: ['Bathroom', 'Bedroom']},
      {name: 'Bedroom Fan', type: 'fan', rooms: ['Bedroom']},
      {name: 'Bedroom Light', type: 'dimmer', rooms: ['Bedroom']},
      {name: 'Goodnight Button', type: 'button', rooms: ['Bedroom']},
      {name: 'Nest Presence Device', type: 'presence', rooms: ['*']},
      {name: 'Michael\'s iPhone', type: 'presence', rooms: ['*']},
      {name: 'Porch Light', type: 'switch', rooms: ['Outside']},
      {name: 'Outside Light', type: 'switch', rooms: ['Outside']},
      {name: 'Outdoor Lights', type: 'switch', rooms: ['Outside']},
      {name: 'Front Door', type: 'Motion', rooms: ['Theater', 'Bedroom', 'Outside']},
      {name: 'Front Door', type: 'Motion', rooms: ['Theater', 'Bedroom', 'Outside']},
      {name: 'Slider', type: 'Acceleration', rooms: ['*']},
      {name: 'Slider', type: 'Temperature', rooms: ['*']},
      {name: 'Slider', type: 'threeAxis', rooms: ['*']},
      {name: 'Slider', type: 'contact', rooms: ['*']},
      {name: 'Bathroom Sensor', type: 'motion', rooms: ['*']},
    ],
  },
  tvguide: {
    guides: [
      {device: 'CA68543', name: 'Frontier FIOS Palm Desert'}
    ]
  },
  tivo: {
    guide: 'CA68543',
    boxes: [
      // device may optionally have a denon receiver device and a guide
      // if guide not provided, the global one for tivo (above) is used
      {device: 'tivo-bolt-3tb', name: 'Theater TiVo', denon: 'denon-s910w', guide: 'CA68543'},
      {device: 'tivo-bolt', name: 'TiVo Bolt', guide: 'CA68543'},
      {device: 'tivo-office2', name: 'Mini Back Office', guide: 'CA68543'},
      {device: 'tivo-office', name: 'Mini Office', guide: 'CA68543'},
      {device: 'tivo-guest', name: 'Mini Guest Room', guide: 'CA68543'},
    ]
  },
  tivoFavorites: [
    {name: 'CNN', channel: '0600'},
    {name: 'MSNBC', channel: '0603'},
    {name: 'FOX NEWS', channel: '0618'},
    {name: 'HGTV', channel: '0665'},
    {name: 'CBS', channel: '0502'},
    {name: 'ABC', channel: '0503'},
    {name: 'NBC', channel: '0507'},
    {name: 'FOX', channel: '0508'},
    {name: 'PBS', channel: '0528'},
    {name: 'COOKING', channel: '0663'},
    {name: 'FOOD', channel: '0664'},
  ],
  denon: {
    receivers: [
      {name: 'Family Room Receiver', device: 'denon-s910w'},
    ],
  },
  lgtv: {
    tvs: [
      {name: 'Family Room TV', device: 'olede6p', denon: 'denon-s910w', favorites: lgtvFavorites}
    ]
  },
  bravia: {
    tvs: [
      {name: 'MBR TV', device: 'sony-850c', favorites: braviaFavorites},
      {name: 'Office TV', device: 'sony-810c', favorites: braviaFavorites}
    ]
  },
  harmony: {
    hubs: [
      {name: 'Family Room', device: 'harmony-hub'},
      {name: 'Master Bedroom', device: 'harmony-hub2'},
    ]
  },
}
