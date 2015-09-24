---
layout: post
title:  "Bloated exports from Pages 5.2 and 5.5"
date:   2014-05-31 21:31:38
---

Recently I noticed something strange in the current Mac version of Apple's [Pages](http://www.apple.com/mac/pages/) (version 5.2 1860). If you create a new blank document and immediately save the file in Pages own format you get a 62 KB file, but if you export it in ".docx" format you get a 493 KB file, almost 8 times bigger. And if you export it in ".doc (Word 1997-2004 compatible)" format, you get a huge 1.5 MB file that's ___24___ times bigger.

So what is it putting in these files?
<!--more-->
Given that .docx formatted documents are basically zip files with a different extension it's quite easy to see what is inside them. Simply append .zip to the filename and double-click on the file to have your Mac open the file with the default zip file handler Archive Utility. And you'll find these files in the extracted folder...

<a class="image" href="{{site.baseurl}}/images/ExtractedUntitledDocx.png" data-lightbox="image-1" data-title="Folder of extracted blank Word docx document files">
<img src="{{site.baseurl}}/images/ExtractedUntitledDocx.png" align="center" style="width:200px;" /></a>

Most of those files are tiny, but that image1.png file in the media folder is 489 KB alone. [A big 635x635px textured blue square.]({{site.baseurl}}/images/image1.png) However why is it there? It is mentioned within the theme files as the fill on a default shape, but there are no shapes in an empty blank document so that PNG file serves no purpose. So that explains the 493 KB file size of the exported docx file.

Unfortunately files in the Word 1997-2004 compatible format use a much less friendly binary format to store their data. There are probably instructions out there to help you parse the format and try to understand what it is doing, but a quick way to check is to load the file into a hex editor like [Hex Fiend](http://ridiculousfish.com/hexfiend/) and search for the "âPNG" and "IEND" markers that respectively indicate the start and end of a PNG file.

<a class="image" href="{{site.baseurl}}/images/HexFiendUntitleddoc.png" data-lightbox="image-2" data-title="The blank Word 97-2004 document in Hex Fiend">
<img src="{{site.baseurl}}/images/HexFiendUntitleddoc.png" style="width:200px;" /></a>

Sure enough the file has that same embedded PNG with its blue texture, but it also has a similar file with a green tint and another similar file with a yellow tint. All of them 489 KB in size and if you subtract the three 489 KB files from that huge 1.5 MB you are left with 69 KB of data. So that explains the extra padding on the Word 1997-2004 formatted document.

Reported to Apple as [rdar://17089255](rdar://17089255).

Meanwhile, if you use Pages to edit documents and need to send someone a file in ".doc (Word 1997-2004 compatible)" format a solution to remove the unnecessary bloat is to open the affected files and then immediately save them again using the same format in [Microsoft Word for Mac](http://www.microsoft.com/mac), [LibreOffice](https://www.libreoffice.org) or the old Pages '09 (tested in version 14.4.2, 4.2.4 and 4.3 1048 respectively). All of them strip out the unnecessary PNG files reducing the file size to something sensible.

**Update October 26, 2014**: Tested in the recently released v5.5 (2109) and Pages is still doing exactly the same thing. My bug report is still sitting untouched almost five months later.