---
layout: post
title:  "Finding Ancestry transcription errors"
image: 
excerpt: ""
date:   2024-07-18 18:00:00
---

One of my pet hates on Ancestry is that now and again their transcribing software will put a comma at the start of a place name.

So instead of offering "Glasgow, Lanark, Scotland" it'll offer ", Glasgow, Lanark, Scotland" like this:

<a class="image" href="{{site.baseurl}}/images/GEDCOM - extra comma.png" data-lightbox="image-1" data-title="Example of a place name with leading comma">
<img src="{{site.baseurl}}/images/GEDCOM - extra comma.png" style="width:500px;" /></a>

I always try to keep an eye out for these and edit the leading comma out but sometimes I miss them. And once they are in your tree, and Ancestry keeps offering them in autocomplete lists, there isn't an easy way to find out which person record they are attached to.

So I created this little tool that parses GEDCOM files and looks for these extra leading commas. You just need to export your family tree as a GEDCOM file from Ancestry (or any other genealogy site with this kind of issue) and then drop it on this page. If it finds any places with leading commas it'll list them and the person records they are attached to, like this...

<a class="image" href="{{site.baseurl}}/images/GEDCOM - parsed.png" data-lightbox="image-1" data-title="Example of the output of a parsed GEDCOM file">
<img src="{{site.baseurl}}/images/GEDCOM - parsed.png" style="width:500px;" /></a>

Then you can go in and amend these places on Ancestry, or whichever genealogy site.

You can find this tool here:

<a style="font-size: 25px; font-weight: bold;" href="https://mcmillan.cx/gedcomparser/">https://mcmillan.cx/gedcomparser/</a>