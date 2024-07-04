---
title: Ramadan Smart Home
date: 2024-06-04
tags: ["homeassistant", "kubernetes", "smart-home"]
---

Moving to Germany exposed me to a very open market of skills and ideas to explore. One thing I really wanted to try was setting up a smart home. Being dedicated to automation and optimization, this was the natural next step for me.

To set up a smart home, you have two options: opt for a proprietary cloud solution like Google Home or Apple HomeKit, or use open-source solutions. I decided to go with Home Assistant due to its excellent support, the wide range of integrations —many of which are created by the community— and because I'm a techie who likes Linux.

Now, I won't get into the boring details of how I run it on a k3s cluster on a Raspberry Pi. The documentation is quite clear, and if you want a quick start on Kubernetes, you can use my [Home Assistant chart](https://github.com/ammarlakis/home-assistant-chart).

The two most common use cases for a smart home are lights control and temperature control. However, since Home Assistant has a wide range of integrations, I discovered that my smart TV can also be controlled using Home Assistant (probably the only smart thing about these smart TVs).

During Ramadan, we used to hear the Maghrib Adhan back home. After moving to Europe, we started playing [the unique Umayyad Mosque group Adhan from YouTube at Maghrib time](https://www.youtube.com/watch?v=bAsoEXIjbME), which is a unique way of performing the call to prayer that dates back to the Ottoman times.

I normally use the app "Mawaqit" to know the prayer times. Fortunately, it has a Home Assistant integration. So, I created an automation with straightforward logic:

1. When the time matches the Maghrib Adhan time in Mawaqit,
2. Turn on the TV,
3. Adjust the volume,
4. Open the YouTube app and play the Adhan video.

I had to add a small delay after starting the TV because the TV startup time is a bit slow. Additionally, we were invited by some friends so we had to enable the Adhan only when we are at home.

Here's what the full automation looks like:

```yaml
alias: Ramadan Iftar Adhan
description: ""
trigger:
  - platform: template
    value_template: >-
      {{ now().utcnow().strftime('%H:%M') ==
      strptime(states('sensor.maghrib_adhan'),
      '%Y-%m-%dT%H:%M:%S+00:00').strftime('%H:%M') }}
condition:
  - condition: zone
    entity_id: person.ammar
    zone: zone.home
action:
  - service: media_player.turn_on
    entity_id: media_player.my_tv
  - delay:
      hours: 0
      minutes: 0
      seconds: 6
      milliseconds: 0
  - service: media_player.volume_set
    target:
      entity_id: media_player.my_tv
    data:
      volume_level: 0.1
  - service: media_player.play_media
    data:
      media_content_type: url
      media_content_id: https://www.youtube.com/watch?v=bAsoEXIjbME
      enqueue: play
      entity_id: media_player.my_tv
mode: single
```

To my delight, my family was quite happy with the result, and many friends liked the idea. It was a small but meaningful way to bring a piece of our tradition into our home in a smart way.
