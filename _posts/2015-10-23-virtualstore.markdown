---
layout: post
title:  "VirtualStore?"
date:   2015-09-23 20:52:38
categories: windows virtualstore processmonitor sap sapgui saplogon.ini
---

The other day I wanted to change the list of servers within my SAP GUI.

<a class="image" href="{{site.baseurl}}/images/SAP Logon Pad.png" data-lightbox="image-1" data-title="SAP GUI aka Logon Pad">
<img src="{{site.baseurl}}/images/SAP Logon Pad.png" style="width:400px;" /></a>

The GUI gets the list from a plain text file called saplogon.ini. That file can be stored anywhere though. If you check PCs with SAP installed it's not unusual to find more than one saplogon.ini file in various places. The quickest way to find the one that is being used is to check  Options within the SAP GUI (click on the icon in the top-left corner of the GUI window and choose "Options..." from the menu). If you select Local Configuration Files it should tell you the location of the saplogon.ini file that is actually in use.

<a class="image" href="{{site.baseurl}}/images/SAP GUI Options.png" data-lightbox="image-1" data-title="SAP GUI Options">
<img src="{{site.baseurl}}/images/SAP GUI Options.png" style="width:400px;" /></a>

So it's using c:\Windows\SAPLOGON.INI. I closed the GUI, swapped that file and reopened the GUI. But it didn't recognise that anything had changed. I tried a few different things but it failed to recognise anything changing. So where was it reading that information from? Even though the software claimed to be reading from c:\Windows\SAPLOGON.INI that didn't seem to be the case.

A handy tool to see where applications are reading and writing to is [Process Monitor](https://technet.microsoft.com/en-us/sysinternals/bb896645) from Sysinternals (now part of Microsoft). By default it shows you pretty much all activity on your machine but you can filter it to look for something specific. In this case I opened the Filter dialog (CTRL-L), created a rule to look for "Path" "contains" "SAPLOGON.INI", clicked the Add button and then OK.

<a class="image" href="{{site.baseurl}}/images/Process Monitor filter for SAPLOGON.INI.png" data-lightbox="image-1" data-title="Process Monitor filter for paths containing SAPLOGON.INI">
<img src="{{site.baseurl}}/images/Process Monitor filter for SAPLOGON.INI.png" style="width:400px;" /></a>

Now with the filter running, I reopened the SAP GUI and as you can see the application was actually reading a completely different saplogon.ini stored in c:\Users\alistair\AppData\Local\VirtualStore\Windows.

<a class="image" href="{{site.baseurl}}/images/Process Monitor filtered on SAPLOGON.INI.png" data-lightbox="image-1" data-title="Process Monitor filtered on SAPLOGON.INI">
<img src="{{site.baseurl}}/images/Process Monitor filtered on SAPLOGON.INI.png" style="width:400px;" /></a>

So what is the VirtualStore folder?
-----------------------------------

From an article on Microsoft's TechNet Magazine called [Inside Windows Vista User Account Control](https://technet.microsoft.com/en-us/magazine/2007.06.uac.aspx) (the feature was introduced with Vista but it's there in later versions of Windows too):

> While some software legitimately requires administrative rights, many programs needlessly store user data in system-global locations.

> Windows Vista enables these legacy applications to run in standard user accounts through the help of file system and registry namespace virtualization. When an application modifies a system-global location in the file system or registry and that operation fails because access is denied, Windows redirects the operation to a per-user area; when the application reads from a system-global location, Windows first checks for data in the per-user area and, if none is present, permits the read attempt from the global location.

> For the purposes of this virtualization, Windows Vista treats a process as legacy if it’s 32-bit (versus 64-bit), is not running with administrative rights, and does not have a manifest file indicating that it was written for Windows Vista.

So Windows is recognising that the version of the SAP GUI that I'm running (version 730) was designed for a previous version of Windows where security wasn't taken so seriously. Although the application thinks it is talking to the ini file in the c:\Windows folder, Windows is actually redirecting those requests to a copy of the file within my own profile where I don't need administrator rights. Quietly behind the scenes. Leaving this legacy application unaware that anything is happening.

So I swapped the file in that VirtualStore folder and the SAP GUI picked up the changes. Alternatively I could have deleted the copy in my VirtualStore and Windows would have allowed the application to talk to the original I'd already changed in the c:\Windows folder.
