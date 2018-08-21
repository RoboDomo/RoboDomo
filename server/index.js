// process.env.DEBUG = '*,-babel*,-express*,-engine*,-socket.io*,-superagent'
process.env.DEBUG = 'Rules,Harmony,HarmonyHost,Controls'

// commented out https setup.  Serving from https domain causes websockets/mqtt to break.
// Even though mqtt is being done to a different host, it must be wss:// or tls somehow.
// deferred this until I can do more research
// a possible solution might be to implement "mqtt" via socket.io to the origin server
const chalk         = require('chalk'),
      //      debug         = require('debug')('Application'),
      host          = process.env.host || '0.0.0.0',
      port          = process.env.port || 3000,
      express       = require('express'),
      proxy         = require('express-http-proxy'),
      //      fs            = require('fs'),
      console       = require('console'),
      //      options       = {
      //        key:  fs.readFileSync(__dirname + '/certs/privateKey.key'),
      //        cert: fs.readFileSync(__dirname + '/certs/certificate.crt'),
      //      },
      app           = express(),
      server        = require('http').Server(app),
      //      https         = require('https'),
      router        = express.Router(),
      path          = require('path'),
      INDEX         = path.join(__dirname, './index.html'),
      SETUP         = path.join(__dirname, './setup.html'),
      webpack       = require('webpack'),
      webpackConfig = require('./webpack.config.js'),
      compiler      = webpack(webpackConfig)

process.on('unhandledRejection', (reason/*, promise*/) => {
  console.log(chalk.red.bold('[PROCESS] Unhandled Promise Rejection'))
  console.log(chalk.red.bold('- - - - - - - - - - - - - - - - - - -'))
  console.log(reason)
  console.log(chalk.red.bold('- -'))
})

app.use('/poolcontrol', proxy('poolcontrol'))
app.use(require('webpack-dev-middleware')(compiler, {
//  noInfo:     true,
  publicPath: webpackConfig.output.publicPath
}))
app.use(require('webpack-hot-middleware')(compiler))

router.get('/', function (req, res) {
  res.sendFile(INDEX)
})
router.get('/setup', function (req, res) {
  res.sendFile(SETUP)
})

router.get('/img/transparent.gif', (req, res) => {
  res.sendFile(__dirname + '/static/img/transparent.gif')
})

app.use(router)
app.use(express.static('node_modules'))
app.use(express.static('server/static'))

//https.createServer(options, app).listen(port, host, () => {
//  console.log(`Server listening at ${host}:${port}`)
//})
server.listen(port, host, () => {
  console.log(`Server listening at ${host}:${port}`)
})

