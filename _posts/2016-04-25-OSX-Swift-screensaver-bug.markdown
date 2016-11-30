---
layout: post
title:  "OSX Swift screen saver bug"
date:   2016-04-25 22:00:00
---

Stumbled on an interesting OS X bug recently.

If you install OS X screen savers written in Apple's new Swift language on your Mac you might see this error. The screen savers run okay when they are launching on their own, but when you try to preview them in System Preferences this message can appear. `You cannot use the ... screen saver with this version of OS X. Please contact the vendor to get a newer version of the screen saver.` Quite a few people are finding [this](https://github.com/JohnCoates/Aerial/issues/227) [error](https://github.com/JohnCoates/Aerial/issues/226) [and](https://github.com/JohnCoates/Aerial/issues/202#issuecomment-177164855) [reporting](https://github.com/JohnCoates/Aerial/issues/196) [screen](https://github.com/JohnCoates/Aerial/issues/177) [savers](https://github.com/JohnCoates/Aerial/issues/168) [are](https://github.com/JohnCoates/Aerial/issues/149) [broken](https://github.com/JohnCoates/Aerial/issues/4).

Contrary to the error message there is nothing really wrong with the screen savers themselves. The bug is in OS X's System Preferences application and the way it is handling the Swift language libraries.

<a class="image" href="{{site.baseurl}}/images/Swift screen saver bug - You cannot use the Aerial screen saver with this version of OS X.png" data-lightbox="image-1" data-title="Example of 'You cannot use the ... screen saver with this version of OS X' error">
<img src="{{site.baseurl}}/images/Swift screen saver bug - You cannot use the Aerial screen saver with this version of OS X.png" style="width:500px;" /></a>

Swift is a new language that is evolving quite quickly. Version 1.0 was released in September 2014, 2.0 was released in September 2015, 2.1 followed quickly in October 2015 and 2.2 was just released in March 2016. As each version can have fundamental changes, when a developer writes an application (or a screen saver) with Swift, that specific version of the Swift libraries is bundled into the application package. In the following screenshot you can see the contents of a screen saver bundle, with the bundled Swift libraries in the Frameworks folder.

<a class="image" href="{{site.baseurl}}/images/Swift screen saver bug - Libraries inside Aerial screen saver.png" data-lightbox="image-1" data-title="Example of the Swift libraries bundled within an OS X screen saver written in Swift">
<img src="{{site.baseurl}}/images/Swift screen saver bug - Libraries inside Aerial screen saver.png" style="width:500px;" /></a>

This bundling is what causes the errors.

When you open System Preferences and select a screen saver written in Swift, the System Preferences application loads the Swift libraries from the application bundle. Then when you select a second screen saver written in Swift, System Preferences doesn't load the Swift libraries from that second screen saver. It just tries to run the screen saver with the Swift libraries it already has loaded. So if the screen saver has been written against a different version of Swift then the screen saver fails to run and you get the "You cannot use the ... screen saver with this version of OS X" error.

The bug is easy to replicate.

1. Download [https://github.com/JohnCoates/Aerial/releases/tag/v1.2beta5](https://github.com/JohnCoates/Aerial/releases/tag/v1.2beta5) and [https://github.com/soffes/clock-saver/releases/tag/v0.5.0](https://github.com/soffes/clock-saver/releases/tag/v0.5.0). These specific versions of these two screensavers use different versions of the Swift libraries.
2. Extract the saver files and place them in your `/Users/YOURNAME/Library/Screen saver` folder.
3. Open System Preferences, select the Desktop & Screen Saver pane, locate the Aerial screen saver and select it. You should see the preview of the screen saver appear.
4. Then select the Clock screen saver. You should see the "You cannot use the Clock screen saver with this version of OS X" error message instead of a preview.

You can confirm what is happening by opening Activity Monitor, selecting the `System Preferences` process from the list and clicking the Info button. The third tab of the Info window shows "Open Files and Ports". The list will be quite long (you can copy and paste the content into a text editor to search it) but you should find some entries for Swift.

As you can see in the following screenshot, although I have the Clock screen saver selected, it is the Swift libraries from the Aerial screen saver that are loaded into the System Preferences process. Hence the "You cannot use the Clock screen saver with this version of OS X" because the Swift libraries loaded into the process and the Swift code in the screen saver don't match.

<a class="image" href="{{site.baseurl}}/images/Swift screen saver bug - Swift libraries open in the System Preferences process.png" data-lightbox="image-1" data-title="Example of the wrong Swift libraries loaded into the System Preferences process">
<img src="{{site.baseurl}}/images/Swift screen saver bug - Swift libraries open in the System Preferences process.png" style="width:500px;" /></a>

For the moment, if you select a screen saver and get this error, just ignore it. Your selected screen saver will launch on schedule. The only problem is that you don't see the preview. If you do want to see the preview, close System Preferences and re-open it. System Preferences will remember your selection and your selected screen saver will preview okay once the application re-opens.

I have reported this bug to Apple as [rdar://25569037](rdar://25569037). 
