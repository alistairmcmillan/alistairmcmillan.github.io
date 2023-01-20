---
layout: post
title:  "Windows 7 low disk space bug"
image: 
excerpt: ""
date:   2023-01-19 23:00:00
---

Problem
-------

Stumbled on this bug recently. If you have a Windows 7 device that usually has a comfortable amount of free space but you're suddenly getting popup warnings about low disk space, then this might have the cause.

Check the `c:\windows\temp` folder on your device. If it is using up a ridiculous amount of disk space, and the folder is full of 100MB files with names formatted like `cbs_123_4` then you have the bug.

<a class="image" href="{{site.baseurl}}/images/Windows temp folder full of cbs temp files.png" data-lightbox="image-1" data-title="Windows temp folder full of cbs temp files">
<img src="{{site.baseurl}}/images/Windows temp folder full of cbs temp files.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>

Cause
-----

It appears that Windows is trying to compress log files, creating a 100MB temp file for the compressed data, but then crashing and restarting. However each time it restarts a new 100MB temp file is created, leaving the previous temp file behind. And just repeating endlessly until the hard drive is full of hundreds or thousands of these 100MB files.

Solution
--------

To fix this issue, step one is to locate the large log file or files in `c:\windows\logs\cbs` that are causing the issue. Typically most of the log files in the folder are a fraction of a gigabyte and compress okay, but there are one or two that are over 1 gigabyte (or 1,000,000 KB) in size that appear to cause the software to crash when they try to compress them. On a few machines I've just deleted these log files that are over 1 gigabyte in size, and then the automatic process is able to compress the rest and the problem seems to stop.

<a class="image" href="{{site.baseurl}}/images/Windows CBS log folder.png" data-lightbox="image-1" data-title="Windows CBS log folder with large log files">
<img src="{{site.baseurl}}/images/Windows CBS log folder.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>

Then step two is just to delete all the `cbs_XXX_X` files in `c:\windows\temp` and you should have your free disk space back.

I'd report it to Microsoft but Windows 7 is out of support now. :)
