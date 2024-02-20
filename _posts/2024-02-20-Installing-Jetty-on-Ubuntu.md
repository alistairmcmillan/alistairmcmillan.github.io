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

The following will tell the operating system that you want Jetty to start at boot...

    sudo systemctl enable jetty9

And this will start the Jetty service...

    sudo systemctl start jetty9

At this point you should be able to open a web browser and visit http://localhost:8080/ to see your Jetty install running.

To stop the service you can run the following...

    sudo systemctl stop jetty9
