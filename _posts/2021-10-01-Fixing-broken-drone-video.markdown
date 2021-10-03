---
layout: post
title:  "Fixing broken drone video"
image: 
excerpt: ""
date:   2021-10-01 12:34:56
---

I recorded some DJI Mini 2 drone video recently and the file seemed to be the right size, but when I tried to open it in anything I'd get errors like "*The document ... could not be opened. The file isn't compatible with QuickTime Player*" or "*The file isn't playable. That might be because the file type is unsupported, the file extension is incorrect, of the file is corrupt.*"

<table style="margin-left:auto;margin-right:auto;"><tr><td><a class="image" href="{{site.baseurl}}/images/The file isn't compatible with QuickTime Player.png" data-lightbox="image-1" data-title="The file isn't compatible with QuickTime Player"><img src="{{site.baseurl}}/images/The file isn't compatible with QuickTime Player.png" style="width:250px;" /></a></td><td>
<a class="image" href="{{site.baseurl}}/images/This file isn't playable.png" data-lightbox="image-1" data-title="This file isn't playable"><img src="{{site.baseurl}}/images/This file isn't playable.png" style="width:250px;" /></a></td></tr></table>

# Background

So what has happened with these files?

Each MP4 file is split up into "atoms". MP4 files typically start with an tiny atom called "ftyp" which lists the encoder used to write the data. The vast majority of an MP4 file will be the actual audio and video data stored in an "mdat" atom. And somewhere in the MP4 file (normally near the end, but near the beginning if the file is intended for streaming) you need a "moov" atom that is basically an index of the mdat atom, explaining where each audio or video track begins and ends, and information about how they were encoded like resolution, sample rate, etc. So even if you have an MP4 file with all the actual audio and video data present and correct, without the moov atom that explains it nothing will know how to play it.

The reason the files can't play is that the moov atom is missing because for some reason the drone didn't write the moov atom at the end of the files.

# Solution 1: The easy one

After trying the more complex solution below I stumbled on this. I had put the memory card with the corrupt file back in my drone and recorded some another video, and when I went to retrieve the new video I noticed the corrupted file was now working. Not entirely sure whether this means the software is smart enough to create a moov atom for any similar file without one, or just that one because it was the last video I recorded with the drone, but it's worth trying.

# Solution 2: The less easy one

[recover_mp4](https://www.videohelp.com/software/recover-mp4-to-h264) is a Windows command line tool created by Dmitry Vasilyev that can create a moov atom by analysing a similar recorded file and using that information to analyse the mdat atom and generate the missing information.

There are three steps to the process.

First thing you need to do is analyse a "good" video recorded on the same device with the same resolution and bitrate settings. This will generate two files video.hdr and audio.hdr.

```
recover_mp4.exe good.mp4 --analyze
```

Then run a command to extract the video (and audio if there is an audio track) from the corrupted file. The output from the first command will give you the exact parameters you need to use but it'll be something like this.

```
recover_mp4.exe corrupt.mp4 result.h264 --noaudio --dji.avc
```

Then you can use a tool like [ffmpeg](https://ffmpeg.org/download.html) to create a new MP4 file from the extracted data. Again the output from the first command will give you the correct parameters to use for your file but it'll look something like this.

```
ffmpeg.exe -r 30000/1001 -i result.h264 -c:v copy result.mp4
```

If everything has worked you should now have a ```result.mp4``` file with your video data.
