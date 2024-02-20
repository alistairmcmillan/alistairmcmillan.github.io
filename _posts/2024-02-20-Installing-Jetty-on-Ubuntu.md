---
layout: post
title:  "Installing Jetty on Ubuntu"
image: 
excerpt: ""
date:   2024-02-20 17:00:00
---

Installing Jetty on Ubuntu 22.04
--------------------------------

Before installing Jetty it's a good idea to run the following three commands first to make sure your Ubuntu install has all its relevant patches...

    sudo apt update
    sudo apt upgrade
    sudo reboot

Run the following command which installs Jetty and its dependencies...

    sudo apt install jetty9

Starting Jetty using systemctl
------------------------------

The following will tell the operating system that you want Jetty to start at boot...

    sudo systemctl enable jetty9

And this will start the Jetty service...

    sudo systemctl start jetty9

At this point you should be able to open a web browser and visit http://localhost:8080/ to see your Jetty install running.

<a class="image" href="{{site.baseurl}}/images/Jetty default install running on Ubuntu.png" data-lightbox="image-1" data-title="Default web page served by Jetty install loaded in Firefox">
<img src="{{site.baseurl}}/images/Jetty default install running on Ubuntu.png" style="width:500px;" /></a>

To stop the service you can run the following...

    sudo systemctl stop jetty9

Starting Jetty from the command line
------------------------------------

The following command will start Jetty using the same parameters and configuration files used by systemctl...

    sudo /usr/bin/java -Djetty.home=/usr/share/jetty9 -Djetty.base=/usr/share/jetty9 -Djava.io.tmpdir=/tmp -jar /usr/share/jetty9/start.jar jetty.state=/var/lib/jetty9/jetty.state jetty-started.xml
