---
layout: post
title:  "Manipulating data using Pivot Tables in Excel"
image: https://alistairmcmillan.github.io/images/Excel_Pivot_Table_results_with_months.png
excerpt: ""
date:   2022-06-10 06:12:47
---

<style type="text/css">
  table {
    margin-bottom: 20px;
  }
  table, tr {
    border: 1px solid black;
  }
  th {
  	background-color: lightgrey;
  	padding: 5px;
  }
</style>

So lets say you have an activity log from an application with a bunch of timestamped actions your minions have taken, and you want to figure out from this know how many hours they were actually working. Something like this...

| Username  | Timestamp            | Action |
| --------- | -------------------- | ------ |
| data      | 30 Sep 2366 09:00:00 | Read   |
| rikerwt   | 30 Sep 2366 09:00:05 | Read   |
| data      | 30 Sep 2366 09:00:10 | Write  |
| data      | 30 Sep 2366 09:00:15 | Read   |
| data      | 30 Sep 2366 09:00:20 | Write  |
| rikerwt   | 30 Sep 2366 09:03:45 | Write  |
| laforgeg  | 01 Oct 2366 17:34:01 | Read   |
| data      | 01 Oct 2366 17:36:45 | Read   |
| laforgeg  | 01 Oct 2366 17:37:19 | Write  |
| data      | 01 Oct 2366 17:37:15 | Read   |
| laforgeg  | 01 Oct 2366 17:48:10 | Read   |
| laforgeg  | 01 Oct 2366 18:00:05 | Write  |

This is a quick method I used to figure this out. There are very likely smarter ways to do it, but this worked for me.

Firstly add a column that drops the minutes and seconds from the timestamps using the formula `=TEXT(B2,"dd mmm yyyy hh")`. This results in something that looks like this...

| Username  | Timestamp            | Action | Timestamp SIMPLIFIED |
| --------- | -------------------- | ------ | -------------------- |
| data      | 30 Sep 2366 09:00:00 | Read   | 30 Sep 2366 09       |
| rikerwt   | 30 Sep 2366 09:00:05 | Read   | 30 Sep 2366 09       |
| data      | 30 Sep 2366 09:00:10 | Write  | 30 Sep 2366 09       |
| data      | 30 Sep 2366 09:00:15 | Read   | 30 Sep 2366 09       |
| data      | 30 Sep 2366 09:00:20 | Write  | 30 Sep 2366 09       |
| rikerwt   | 30 Sep 2366 09:03:45 | Write  | 30 Sep 2366 09       |
| laforgeg  | 01 Oct 2366 17:34:01 | Read   | 01 Oct 2366 17       |
| data      | 01 Oct 2366 17:36:45 | Read   | 01 Oct 2366 17       |
| laforgeg  | 01 Oct 2366 17:37:19 | Write  | 01 Oct 2366 17       |
| data      | 01 Oct 2366 17:37:15 | Read   | 01 Oct 2366 17       |
| laforgeg  | 01 Oct 2366 17:48:10 | Read   | 01 Oct 2366 17       |
| laforgeg  | 01 Oct 2366 18:00:05 | Write  | 01 Oct 2366 18       |

Secondly add another column that looks for unique instances of the user and the simplified timestamp using the formula `=IF(COUNTIFS($A$2:A2,A2,$D$2:D2,D2)>1,0,1)`. This should give you something that looks like this...

| Username  | Timestamp            | Action | Timestamp SIMPLIFIED | UNIQUE |
| --------- | -------------------- | ------ | -------------------- | ------ |
| data      | 30 Sep 2366 09:00:00 | Read   | 30 Sep 2366 09       | 0      |
| rikerwt   | 30 Sep 2366 09:00:05 | Read   | 30 Sep 2366 09       | 0      |
| data      | 30 Sep 2366 09:00:10 | Write  | 30 Sep 2366 09       | 0      |
| data      | 30 Sep 2366 09:00:15 | Read   | 30 Sep 2366 09       | 0      |
| data      | 30 Sep 2366 09:00:20 | Write  | 30 Sep 2366 09       | 1      |
| rikerwt   | 30 Sep 2366 09:00:05 | Write  | 30 Sep 2366 09       | 1      |
| laforgeg  | 01 Oct 2366 17:34:01 | Read   | 01 Oct 2366 17       | 0      |
| data      | 01 Oct 2366 17:36:45 | Read   | 01 Oct 2366 17       | 0      |
| laforgeg  | 01 Oct 2366 17:37:19 | Write  | 01 Oct 2366 17       | 0      |
| data      | 01 Oct 2366 17:37:15 | Read   | 01 Oct 2366 17       | 1      |
| laforgeg  | 01 Oct 2366 17:48:10 | Read   | 01 Oct 2366 17       | 1      |
| laforgeg  | 01 Oct 2366 18:00:05 | Write  | 01 Oct 2366 18       | 1      |

Lastly select the five columns and insert a Pivot Table in a new sheet. Add Username as a row, add Timestamp SIMPLIFIED as a value (which Excel should automatically add as a count of the values), and add the UNIQUE column as a filter. It should look something like this...

<a class="image" href="{{site.baseurl}}/images/Excel Pivot Table Fields.png" data-lightbox="image-1" data-title="Example of fields in Excel Pivot table">
<img src="{{site.baseurl}}/images/Excel Pivot Table Fields.png" style="width:250px;" /></a>

Then change the filter to just select "1" and you are left with the unique entries for each user for each hour. And you should have your result, looking something like this. In this example showing that data worked one hour and laforgeg worked two hours.

<a class="image" href="{{site.baseurl}}/images/Excel Pivot Table results.png" data-lightbox="image-1" data-title="Example of results in Excel Pivot table">
<img src="{{site.baseurl}}/images/Excel Pivot Table results.png" style="width:500px;" /></a>

You may want to break down the hours further, by month for example. Add a new column with the formula `=TEXT(B2,"mmm")` to extract the month on it's own. To make life easier, don't add the new column at the end of the data, add it between the existing columns of data that the Pivot Table knows about. That way the Pivot Table will automatically pick up the new column. So you should have something like this...

| Username  | Timestamp            | Action | Timestamp SIMPLIFIED | MONTH | UNIQUE |
| --------- | -------------------- | ------ | -------------------- | ----- | ------ |
| data      | 30 Sep 2366 09:00:00 | Read   | 30 Sep 2366 09       | Sept  | 0      |
| rikerwt   | 30 Sep 2366 09:00:05 | Read   | 30 Sep 2366 09       | Sept  | 0      |
| data      | 30 Sep 2366 09:00:10 | Write  | 30 Sep 2366 09       | Sept  | 0      |
| data      | 30 Sep 2366 09:00:15 | Read   | 30 Sep 2366 09       | Sept  | 0      |
| data      | 30 Sep 2366 09:00:20 | Write  | 30 Sep 2366 09       | Sept  | 1      |
| rikerwt   | 30 Sep 2366 09:00:05 | Write  | 30 Sep 2366 09       | Sept  | 1      |
| laforgeg  | 01 Oct 2366 17:34:01 | Read   | 01 Oct 2366 17       | Oct   | 0      |
| data      | 01 Oct 2366 17:36:45 | Read   | 01 Oct 2366 17       | Oct   | 0      |
| laforgeg  | 01 Oct 2366 17:37:19 | Write  | 01 Oct 2366 17       | Oct   | 0      |
| data      | 01 Oct 2366 17:37:15 | Read   | 01 Oct 2366 17       | Oct   | 1      |
| laforgeg  | 01 Oct 2366 17:48:10 | Read   | 01 Oct 2366 17       | Oct   | 1      |
| laforgeg  | 01 Oct 2366 18:00:05 | Write  | 01 Oct 2366 18       | Oct   | 1      |

Then if you select a cell in the Pivot Table, right-click and select Refresh you should now see the new column visible in the list of fields. Drag it to the Rows box under Username like this...

<a class="image" href="{{site.baseurl}}/images/Excel Pivot Table Fields with months.png" data-lightbox="image-1" data-title="Example of fields in Excel Pivot table">
<img src="{{site.baseurl}}/images/Excel Pivot Table Fields with months.png" style="width:250px;" /></a>

And the Pivot Table should update to break down your data by month as well as Username. Like so... 

<a class="image" href="{{site.baseurl}}/images/Excel_Pivot_Table_results_with_months.png" data-lightbox="image-1" data-title="Example of results in Excel Pivot table">
<img src="{{site.baseurl}}/images/Excel_Pivot_Table_results_with_months.png" style="width:500px;" /></a>


