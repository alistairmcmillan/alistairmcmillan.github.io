---
layout: post
title: "How to add a DatePicker to a Windows Phone 8 app"
date: 2014-05-18 15:37:55 +0100
---

I've been playing about with Microsoft's Windows Phone developer tools. I wanted to add a Date Picker control. Based on using Xcode I thought this would be easy. It wasn't.
<!--more-->
For comparison, here is how you add a Date Picker control to your iPhone or iPad app...

* Start typing "Date" into the search box at the bottom of the Object library in the bottom-right corner of the Xcode window, and the "Date Picker" object quickly appears.
* Drag the object into place.

<a href="{{site.baseurl}}/images/Xcode_DatePicker.png" data-lightbox="image-1" data-title="Date Picker object in Xcode">
<img src="{{site.baseurl}}/images/Xcode_DatePicker.png" style="width:200px;" /></a>

And here is how you do it in a Windows Phone 8 app.

* Open the Package Manager Console from the Tools menu. Tools -> NuGet Package Manager -> Package Manager Console.

* Within the Package Manager Console type "Install-Package WPtoolkit" to instruct Visual Studio to install the Windows Phone Toolkit.

<a href="{{site.baseurl}}/images/VS_Install-Package_WPtoolkit.png" data-lightbox="image-1" data-title="Installing the WPtoolkit in Visual Studio">
<img src="{{site.baseurl}}/images/VS_Install-Package_WPtoolkit.png" style="width:200px;" /></a>

* Near the top of the XAML file where you want to use a DatePicker add the following line of code: `xmlns:toolkit="clr-namespace:Microsoft.Phone.Controls;assembly=Microsoft.Phone.Controls.Toolkit`

<a href="{{site.baseurl}}/images/VS_toolkit_namespace.png" data-lightbox="image-1" data-title="Adding the Microsoft.Phone.Controls namespace in Visual Studio">
<img src="{{site.baseurl}}/images/VS_toolkit_namespace.png" style="width:200px;" /></a>

* Then where you want to include a DatePicker control add the following line of code: `<toolkit:DatePicker />`

<a href="{{site.baseurl}}/images/VS_DatePicker.png" data-lightbox="image-1" data-title="Adding a DatePicker control in Visual Studio">
<img src="{{site.baseurl}}/images/VS_DatePicker.png" style="width:200px;" /></a>

There may be an easier way, but this took over an hour of searching Google and reading through forum posts until I found a way that actually worked.
