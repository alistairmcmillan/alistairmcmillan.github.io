---
layout: post
title:  "Windows 7 low disk space bug"
image: 
excerpt: ""
date:   2023-01-19 23:00:00
---

Problem
-------

Stumbled on this bug recently. If you have a Windows 7 device that usually has a comfortable amount of free space but you're suddenly getting popup warnings about "low disk space", then this might be the cause.

Check the `c:\windows\temp` folder on your device. If it is using up a ridiculous amount of space, and the folder is full of 100MB files with names formatted like `cbs_123_4` then your device has the bug.

<a class="image" href="{{site.baseurl}}/images/Windows temp folder full of cbs temp files.png" data-lightbox="image-1" data-title="Windows temp folder full of cbs temp files">
<img src="{{site.baseurl}}/images/Windows temp folder full of cbs temp files.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>

Cause
-----

It appears that Windows is trying to compress .log files into .cab files (Microsoft's version of ZIP files). To do this it creates a 100MB temp file to put the compressed data in, but then it seems like the software is failing and restarting. But each time it restarts it creates a new 100MB temp file, leaving the previous temp file behind. And that just repeats endlessly until the hard drive is full of hundreds or thousands of these 100MB temp files.

Solution
--------

Fixing the issue is relatively easy.

**Step one**: delete all the `cbs_XXX_X` files in `c:\windows\temp` and you should have your free disk space back. But to stop it filling up again...

**Step two**: locate the excessively large file or files in `c:\windows\logs\cbs` that are causing the software to fail and leave behind those temp files, and delete them (see note 1). Typically most of the CbsPersist log files in the folder are a fraction of a gigabyte and compress okay, but there are usually one or more that are over 1 gigabyte (aka 1,000,000 KB) in size that cause the software to fail when it tries to compress them. Delete any log files in that folder that are over 1 gigabyte in size, and then the automatic process should be able to compress the rest and the problem stops.

<a class="image" href="{{site.baseurl}}/images/Windows CBS log folder.png" data-lightbox="image-1" data-title="Windows CBS log folder with large log files">
<img src="{{site.baseurl}}/images/Windows CBS log folder.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>

**Note 1**: the log files just contain diagnostic information on the installations and patches on the device. If you think the files should be retained, just move them to another folder instead of deleting them.

**Note 2**: The automatic process that compresses the log files doesn't seem to immediately notice the deletion. I've just left it a few hours and then when I've checked the remaining reasonable-sized log files have all been successfully compressed.

I'd report it to Microsoft but I've only seen this bug on Windows 7 devices, and Windows 7 is out of support now. :)
