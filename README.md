# RoboDomo
Home for the RoboDomo home automation suite

## Goals for RoboDomo

1. Node JS, JavaScript based core and UI.
2. MQTT real-time interfaces.
3. Direct and smart support for various devices.
4. Ideally eliminate the cloud altogether.
5. Alexa and/or Google Home integration.
6. Dashboard/tiles mode, suitable for devices hung on the wall or cheap phone on the nightstand.
7. Dockerize and separate concerns, allowing for plugability and simplification of controls and status reporting.

## History

I began this home automation system several months ago with the above design principles in mind.

I don't want to write the UI in JavaScrpt and the back end in some variety of languages.  As long as
it's JavaScript, even the configuration files should be JavaScript. Not JSON, actual JavaScript.

Implementation of device support as MQTT microservices allows for modular installation and a consistent API.  For example, if you have a pool with an Autelis pool controller/interface, you set it up and run it, enable it in the core server as well.

Decoupling the UI from the back end allows anyone to implement their own UI.  The initial UI is written in React with Twitter Bootstrap styling.  It wouldn't be hard at all to swap it out for a Material based design, though Material didn't prove to be as flexible in the designs I have in mind.  Another benefit is that shell scripts can trivially interact with MQTT and control devices - suitable for cron jobs or just doing things by typing in commands.

The UI is responsive at the JavaScript level.  The code detects small screen and renders views designed for small screen, vs. trying to make a one-size-fits-all scheme work.

## Initial device support
All of these things are already working:

1. Autelis Pool Control
2. Sony Bravia TVs
3. Denon AVR
4. Harmony Hub/Remote
5. LG TV (WebOS)
6. Nest Thermostat
7. TiVo DVR AND Mini (set top box)
8. TV Guide info provided thorugh Schedules Direct (a mere $25/year subscription fee)
9. Weather provided by Nest

## Roadmap

The roadmap, or things that need to be done, include but are not limited to:

1. Configuration is currently done via environment variables set for the microservices and
a single JavaScript Config.js file.  Configuration should be done via
a WWW interface, which is already under construction.  See the screenshots
to get an idea where it's headed.  That's not at all working enough to
use in practice, but it's coming along nicely.  The microservices
should get their configuration from the new setup schee (likely from
a mongodb database).
2. The Web App uses Twitter Bootstrap for styling, the Setup App uses
material-ui.  While the Bootstrap look is decent, moving it all to
material-ui is in the cards.
3. Even better mash up kinds of screens, beyond what dashboards can do.
For example, a theater screen that has buttons for the ceiling fan,
to control the TiVo, Smart TV, and AVR, control the A/C, and buttons
to pause and resume the TV (turning on / off lights) for bathroom breaks.
4. Add controls and microservices for devices beyond the ones initially supported.
Samsung TVs are next on my list, but anyone who wants to contibute is
welcome to.  Contact me by creating an issue if you are interested.
5. This is not a commercial product.  I hope people will freely use it and contribute
if it suits their needs.  The license info/file for the projects
need to be made clear (for each repo).
6. DockerHub has virtually no content other than the actual container
images.  Those pages need to be done up with documentation and links
back to GitHub.
7. Versioning. Right now everything is 1.0.0 and :latest (on DockerHub)
8. Unit testing (Mocha)
9. Continuous integration.
10. Long term testing.  The microservices seem robust enough, but over the long term,
bugs have cropped up.  These need to be tightened up so the microservices
do appropriate retry and handle failures gracefully in all cases.


## Screenshots
This is the RoboDomo dashboard screen on iPad.  There are two dashboards
defined with tabs at the top to select between the two.  You might hang an iPad or
other tablet on the wall and have this screen showing 99% of the time.  Everything
you care about at a glance.

![Dashboard iPad](https://raw.githubusercontent.com/RoboDomo/RoboDomo/master/screenshots/Dashboard-iPad.png)

You might have a phone on your nightstand or on the wall in the bedroom.  The dashboard
for its screen would have different tiles with information/controls more suited
to the bedroom location.

![Dashboard iPad](https://raw.githubusercontent.com/RoboDomo/RoboDomo/master/screenshots/Dashboard-Phone.png)

Tapping on a tile brings you to the controls screens.  This screenshot
shows what the TiVo control screen looks like on iPad.  Note there are 5 tabs, one for
each TiVo DVR/Mini in the house.  The volume controls are generic and for the Theater TiVo
controls the Denon AVR volume.  This kind of mash up puts the "smart" in "smart home controls."
Also note the favorites dropdown, which is individually configurable per
TiVo, as well as the History buttons, which is a custom feature inplemented
in RoboDomo.  The station logos are a feature enabled by the SchedulesDirect integration.

![Dashboard iPad](https://raw.githubusercontent.com/RoboDomo/RoboDomo/master/screenshots/TiVo-iPad.png)

More screenshots here:
https://github.com/RoboDomo/RoboDomo/tree/master/screenshots

## AutoDomo in action (use cases)

I live in the desert and have a swimming pool.  

In the summer, the filter pump needs to run for an hour per 10 degrees F over 40 degrees.  Rather than manually setting the pool functions by timer in the hardware control panel and adjusting the hours needed to run, AutoDomo is capable of looking at the weather data for projected high temperature and turning on the filter pump for the correct number of hours.

In the winter, it takes as long as an hour to heat up the hot tub/spa to a temperature I like.  When I turn it on with AutoDomo UI, I get notifications (text messages, emails, even on the LGTV screen) as the temperature goes up each 10 degrees, and ultimately when the spa is ready.  Without AutoDomo, I'd have to walk to the back end of the house, in the far corner of the master bedroom, to look at the temperature on the physical pool/spa control panel.

The outdoor low voltage lights were on a physical timer outside.  If I didn't stay on top of changing the timer/control, the lights would end up turning on long before sunset, or long after sunset.  With AutoDomo, the lights turn on automatically at sunset, as they should, and turn off at 1AM (I am asleep by then).

When I'm watching TV in my theater room (family room), I want an iPad screen that allows me to control all the TV functions as well as attached devices.  That is, the DVD player, the smart TV apps, the XBox One S, the TiVo, the Denon AVR, the ceiling fan light and fan, the thermostat, etc.  AutoDomo's theater screens allow me to group all those controls into one screen, intelligently done.  Similarly, a 2nd tab on the theater screen allows me control the same sorts of things for the master bedroom's gear.

I've turned on the Spa, gone in, and forgotten to turn it off a few times now.  AutoDomo will alert me that the Spa is running, so I won't forget.  Same thing for the waterfall feature for the pool.

I installed a motion detector in the master bathroom, as well as a dimmer switch.  It's dark enough in there during the day that when motion is detected, I have the lights go on full brightness.  After I'm in bed and through about the time I wake up in the morning, if I go in the bathroom, the lights automatically turn on at 20% which is comfortable for that time of night.

I have a door/window sensor on the slider going out to the backyard/pool area.  After sunset and the door is opened, the outside light turns on so I can see.  It's also useful to turn on that light to be able to see when getting out of the Spa after dark.

I have smart switches on the front porch light and the entry way light.  When I have guests over and it's time for them to leave, I can turn them both on with one button press (or via Alexa) and they automatically turn off after 10 minutes.  This allows my guests to be able to see on their way to their car.

I have a "bedtime" program that gets run when I'm ready for bed.  It turns on the lights, which are usually off when watching TV, the ceiling fan off (don't need it anymore), turns on the lights on the way to the master bedroom, on the ceiling fan and lights in the bedroom.

I have a "goodnight" program that gets run when I'm in bed.  This program turns off all the ceiling fans (outside the bedroom one), all the lights, the spa, etc.  I never wake up to find I forgot to turn something off.

While in goodnight mode, I can turn on "overnight" mode, which turns on lights (dim/night lights style) from the MBR to the kitchen.  Useful for when I get up in the middle of the night and want a glass of water.  Goodnight program again turns it all off again.

I have ceiling fan controls that have 4 states: off, low, medium, high.  For some reason, I've not seen home automation software that renders a control for the UI that has 4 states.  Usually they have on/off button/switch and a slider, as if the fan is a dimmer.

These are just a few use cases.  The system should allow whatever you can conceive and that there is technology to support.

## DNS setup

I have three  suggestions for managing your DHCP address assignments

First, I set my NETMASK to 255.255.0.0.  Most people probably just use up to 254 IP addresses  for their LAN.  This NETMASK allows you to use any IP address in the 192.168.*.* range.  That is, 192.168.0.*, 192.168.1.*, 192.168.2.*, and so on.  You now have 65536 IP addresses to assign as you see fit.

Second, I set up dnsmasq to assign a static IP to absolutely every device that's normally in my home.  That includes my TVs, my harmony hubs, the TiVo DVRs and set top boxes, my phones and tablets, my SmartThings hub...  EVERY device!

Third, in order to have a lot of flexibility to adding devices of a particular type (home theater, mobile devices, etc.), I assign a block of 255 IPs to the categories:

- 192.168.0.* - my router/gateway, my time capsule, etc.
- 192.168.1.* - my computers and laptops
- 192.168.2.* - my mobile devices (phones, tablets)
- 192.168.3.* - my home automation devices (amazon echo, ring doorbell, smartthings hub, thermostat, fitbit scale, etc.)
- 192.168.4.* - my home entertainment devices (smart tvs, TiVo defices, harmony remotes, roku, apple tv, audo receivers, etc.)


## Microservices / Docker

Each of the microservices are available through GitHub repositories:
https://github.com/RoboDomo

Alternatively, you can simply run the pre-built docker container images pulled
directly from DockerHub:
https://hub.docker.com/u/robodomo/dashboard/

Instructions for configuration and running each microservice is in the README
in the GitHub repository for each one.

