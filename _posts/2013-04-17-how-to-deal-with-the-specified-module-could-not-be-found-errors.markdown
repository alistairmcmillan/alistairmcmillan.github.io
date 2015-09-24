---
layout: post
title:  "How to deal with 'The specified module could not be found' errors"
date:   2013-04-17 18:33:15
---

When regsvr32 fails with the error `LoadLibrary("softekatl.dll") failed - The specified module could not be found.` it doesn't necessarily mean it couldn't find the specified module. It might mean it couldn't find another DLL file that the specified module depends on.

<a class="image" href="{{site.baseurl}}/images/LoadLibrary-failed.png" data-lightbox="image-2" data-title="LoadLibrary failed error">
<img src="{{site.baseurl}}/images/LoadLibrary-failed.png" style="width:200px;" /></a>

Unfortunately Windows XP doesn't seem to include tools to help you work out which DLL is actually the cause of the error...

How do I work out which dependency is causing LoadLibrary to fail?
------------------------------------------------------------------
Download [Dependency Walker](http://www.dependencywalker.com) and run it on the affected PC. Click the Open button and select the DLL that regsvr32 is having problems loading. Dependency Walker will build a tree of all the dependencies and their dependencies and so on. If a particular DLL is missing you should get an `Error opening file. The system cannot find the file specified.` error, as shown in the screenshot below.

<a class="image" href="{{site.baseurl}}/images/Dependency-Walker.png" data-lightbox="image-2" data-title="Dependency Walker">
<img src="{{site.baseurl}}/images/Dependency-Walker.png" style="width:200px;" /></a>

Find that missing DLL, install it on the machine in a location where Windows will be able to find it and regsvr32 should now be able to register that original DLL you were having a problem with.

Where do I find MSVCR70.DLL?
----------------------------

Version 7.0 of the Microsoft Visual C Runtime was distributed with version 1.0 of the .NET Framework. You can download it from <http://www.microsoft.com/en-us/download/details.aspx?id=96>.

Install it on the machine and the machine will now have that MSVCR70.DLL file you want.

How do I deal with "The install cannot continue because this version of the .NET Framework is incompatible with a previously installed one." errors?
---------------------------------------------------------------------------------------------------------------------------------------------------

So... you've tried to install version 1.0 of the .NET Framework and it failed with the error `The install cannot continue because this version of the .NET Framework is incompatible with a previously installed one. For more information, see http://support.microsoft.com/support/kb/articles/q312/5/00.asp`.

<a class="image" href="{{site.baseurl}}/images/Microsoft-NET-Framework-Install-cannot-continue-because.png" data-lightbox="image-2" data-title="Microsoft NET Framework - Install cannot continue because error">
<img src="{{site.baseurl}}/images/Microsoft-NET-Framework-Install-cannot-continue-because.png" style="width:200px;" /></a>

You might think you would visit <http://support.microsoft.com/support/kb/articles/q312/5/00.asp> but Microsoft changed their website and that URL just redirects to the front page of their Support website. Thank you Microsoft.

Your mileage might vary... but for me, installing version 1.1 of the .NET Framework (which you can download from <http://www.microsoft.com/en-us/download/details.aspx?id=26>) and then version 1.0 worked. Please don't ask why. And please don't ask how long it took me to work that out.

How can I make it so Windows knows how to find MSVCR70.DLL?
-----------------------------------------------------------

So... now you have MSVCR70.dll installed on the machine, but Windows can't find it, because regsvr32 is still failing with the same error.

<a class="image" href="{{site.baseurl}}/images/LoadLibrary-failed.png" data-lightbox="image-2" data-title="LoadLibrary failed error">
<img src="{{site.baseurl}}/images/LoadLibrary-failed.png" style="width:200px;" /></a>

The .NET Framework 1.0 installer puts the MSVCR70.DLL file in a folder called `c:\WINDOWS\Microsoft.NET\Framework\v1.0.3705`. Add that folder location to the PATH variable in Windows and then Windows will be able to find the MSVCR70.dll file.

How do I add folder locations to the PATH variable in Windows?
--------------------------------------------------------------

Open the System applet within Control Panel. Select the Advanced tab and click on the Environment Variables button. Then find and select the Path variable under the System variables section and click on the Edit button. Add `;c:\WINDOWS\Microsoft.NET\Framework\v1.0.3705` to the end of the existing path. Don't forget to include a semi-colon before the new folder location to separate it from the existing locations. Then click OK a few times until the System applet has disappeared.

<a class="image" href="{{site.baseurl}}/images/Advanced-tab-of-System-Properties.png" data-lightbox="image-2" data-title="Advanced tab of System Properties">
<img src="{{site.baseurl}}/images/Advanced-tab-of-System-Properties.png" style="width:200px;" /></a>

<a class="image" href="{{site.baseurl}}/images/Edit-System-Variables.png" data-lightbox="image-2" data-title="Edit System Variables">
<img src="{{site.baseurl}}/images/Edit-System-Variables.png" style="width:200px;" /></a>

Finally...
----------

If you try to register your DLL it should now work.

<a class="image" href="{{site.baseurl}}/images/LoadLibrary-succeeded.png" data-lightbox="image-2" data-title="LoadLibrary succeeded">
<img src="{{site.baseurl}}/images/LoadLibrary-succeeded.png" style="width:200px;" /></a>
