# autodomo
Home for the autodomo home automation suite

## Goals for autodomo

1. Node JS, JavaScript based core and UI.
2. MQTT real-time interfaces.
3. Direct and smart support for various devices.
4. Ideally eliminate the cloud altogether.
5. Alexa and/or Google Home integration.
6. Dashboard/tiles mode, suitable for devices hung on the wall or cheap phone on the nightstand.

## History

I began this home automation system several months ago with the above design principles in mind.

I don't want to write the UI in JavaScrpt and the back end in some variety of languages.  As long as
it's JavaScript, even the configuration files should be JavaScript. Not JSON, actual JavaScript.

Implementation of device support as MQTT microservices allows for modular installation and a consistent API.  For example, if you have a pool with an Autelis pool controller/interface, you set it up and run it, enable it in the core server as well.

Decoupling the UI from the back end allows anyone to implement their own UI.  The initial UI is written in React with Twitter Bootstrap styling.  It wouldn't be hard at all to swap it out for a Material based design, though Material didn't prove to be as flexible in the designs I have in mind.  Another benefit is that shell scripts can trivially interact with MQTT and control devices - suitable for cron jobs or just doing things by typing in commands.

The UI is responsive at the JavaScript level.  The code detects small screen and renders views designed for small screen, vs. trying to make a one-size-fits-all scheme work.

## Initial device support
1. Autelis Pool Control
2. Sony Bravia TVs
3. Denon AVR
4. Harmony Hub/Remote
5. LG TV (WebOS)
6. Nest Thermostat
7. TiVo DVR AND Mini (set top box)
8. TV Guide info provided thorugh Schedules Direct (a mere $25/year subscription fee)
9. Weather provided by Nest

## Screenshots
This is the RoboDomo dashboard screen on iPad.  There are two dashboards
defined with tabs at the top to select between the two.  You might hang an iPad or
other tablet on the wall and have this screen showing 99% of the time.  Everything
you care about at a glance.

![Dashboard iPad](https://raw.githubusercontent.com/RoboDomo/RoboDomo/master/screenshots/Dashboard-iPad.png)

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

