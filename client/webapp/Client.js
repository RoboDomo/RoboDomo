// Screens
import DashboardScreen from "./screens/DashboadScreen";
import ThingsScreen from "./screens/ThingsScreen";
import ThermostatScreen from "./screens/ThermostatScreen";
import AutelisScreen from "./screens/AutelisScreen";
import PoolControlScreen from "./screens/PoolControlScreen";
import WeatherScreen from "./screens/WeatherScreen";
import TiVoScreen from "./screens/TiVoScreen";
import LGTVScreen from "./screens/LGTVScreen";
import BraviaScreen from "./screens/BraviaScreen";
import DenonScreen from "./screens/DenonScreen";
import HarmonyScreen from "./screens/HarmonyScreen";
import NotFoundScreen from "./screens/NotFoundScreen";

const bowser = require("bowser");

const screenSize = bowser.mobile ? "small" : "normal";

export default {
  screenSize: screenSize,
  ui: {
    panelType: "primary",
    subPanelType: "default",
    bsSize: screenSize === "small" ? "small" : "large",
    // these two add up to 12
    labelCol: screenSize === "small" ? 3 : 4,
    fieldCol: screenSize === "small" ? 9 : 8,
    // style for remote buttons, denon buttons, etc.
    buttonStyle:
      screenSize === "small"
        ? {
            width: 56,
            height: 30
          }
        : {
            width: 100,
            height: 40
          },
    buttonSize: screenSize === "small" ? "small" : null,
    controlButtonStyle: {
      width: 100,
      height: 40
    },
    miniButtonStyle:
      screenSize === "small"
        ? {
            width: 30,
            height: 30
          }
        : {
            width: 50,
            height: 40
          },
    controlSpace: 20
  },
  routes: {
    dashboard: { text: "Dashboard", screen: DashboardScreen },
    things: { text: "SmartThings", screen: ThingsScreen },
    thermostat: { text: "Thermostat", screen: ThermostatScreen },
    autelis: { text: "Autelis", screen: AutelisScreen },
    poolcontrol: { text: "Autelis Panel", screen: AutelisScreen },
    weather: { text: "Weather", screen: WeatherScreen },
    tivo: { text: "TiVo", screen: TiVoScreen },
    lgtv: { text: "LG TV", screen: LGTVScreen },
    bravia: { text: "Sony TV", screen: BraviaScreen },
    denon: { text: "Denon AVR", screen: DenonScreen },
    harmony: { text: "Harmony Hubs", screen: HarmonyScreen },
    notFound: { text: "Not Found", screen: NotFoundScreen }
  },
  dashboards: {
    defaults: [
      // {type: 'clock'},
      // {type: 'weather'},
      // {type: 'thermostat', device: 'Falsetto/SmartThings Nest'},
      // {type: 'pool'},
      // {type: 'spa'},
    ],
    boards: [
      {
        title: "Theater",
        key: "theater",
        tiles: [
          { type: "clock" },
          { type: "weather" },
          { type: "thermostat", device: "Falsetto/SmartThings Nest" },
          { type: "pool" },
          { type: "spa" },
          {
            type: "theater",
            denon: "denon-s910w",
            tv: "olede6p",
            settop: "hdmi1",
            tivo: "tivo-bolt-3tb"
          },
          {
            type: "smartthings",
            title: "Theater",
            controls: [
              { device: "Ceiling Fan", type: "fan" },
              { device: "Ceiling Fan Light", type: "dimmer" },
              { device: "Kitchen Lights", type: "dimmer" },
              { device: "Porch Light", type: "switch" },
              { device: "Outside Light", type: "switch" },
              { device: "Bathroom Light", type: "dimmer" }
            ]
          }
        ]
      },
      {
        title: "MBR",
        key: "mbr",
        tiles: [
          { type: "clock" },
          { type: "thermostat", device: "Falsetto/SmartThings Nest" },
          { type: "weather" },
          { type: "spa" },
          {
            type: "smartthings",
            title: "Theater",
            controls: [
              { device: "Bedroom Fan", type: "fan" },
              { device: "Bedroom Light", type: "dimmer" },
              { device: "Bathroom Light", type: "dimmer" }
            ]
          }
        ]
      }
    ],
    navigation: [
      { type: "link", label: "SmartThings", href: "things" },
      { type: "link", label: "LG TV", href: "lgtv" },
      { type: "link", label: "Denon AVR", href: "denon" },
      { type: "link", label: "Harmony Hubs", href: "harmony" }
    ]
  }
};
