---
layout: post
title:  "Unable to locate a Java Runtime to invoke"
date:   2012-08-31 14:46:00
categories: macosx java
---

Tried to install the Android SDK today and OS X prompted me to install Java, which it did but then the Android SDK Manager failed with this error.

"Unable to locate a Java Runtime to invoke."

Did a search on Google that turned up a bunch of results with a ton of really bad advice (including "Insert the system disk that came with your computer and start the installer from the desktop to re-install the system...").

Turns out to be a simple fix.

Open Java Preferences from /Applications/Utilities and tick a box to tell the system which Java virtual machine you want to use.

![Java Preferences](/images/Java-Preferences.png)
