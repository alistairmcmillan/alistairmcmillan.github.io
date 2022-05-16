---
layout: post
title:  "Experimenting with Postman and REST APIs"
image: 
excerpt: ""
date:   2022-05-07 00:10:00
---

[Postman](https://www.postman.com/downloads/) is a fantastic tool that lets you interact with REST APIs.

A few examples.

JIRA REST API
-------------

List of projects in JIRA
========================

Lets say you want to get a list of all the projects in a JIRA instance.

1. Where it says "Enter request URL" type in the url for the request, for example something like this: `https://jira.starfleet.com/rest/api/2/project`
2. Set the request type to GET as we're just retrieving information with this request.
3. If Basic Auth is available in your JIRA instance select the "Auth" tab, change the "Type" dropdown to "Basic Auth", and enter your username and password. Postman will automatically encode your username and password using base64, and add the result as a header to the request. You can see this as a hidden auto-generated header under the Headers tab.
4. Click the big blue "Send" button and all being well you should see the response to your request in the bottom pane, in this case listing all the projects.

<a class="image" href="{{site.baseurl}}/images/postman_jira.png" data-lightbox="image-1" data-title="Postman screenshot showing execution of JIRA GET request">
<img src="{{site.baseurl}}/images/postman_jira.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>

Changing the Component Lead in JIRA
===================================

1. Where it says "Enter request URL" type in the url for the request, for example something like this: `https://jira.starfleet.com/rest/api/2/component/16309`
2. Set the request type to PUT as we're updating existing information with this request.
3. If Basic Auth is available in your JIRA instance select the "Auth" tab, change the "Type" dropdown to "Basic Auth", and enter your username and password. Postman will automatically encode your username and password using base64, and add the result as a header to the request. You can see this as a hidden auto-generated header under the Headers tab.
4. Under the "Body" tab change the type to "raw" and the format to "JSON" and enter the following with your username of choice:
{% highlight json %}
    {
        "leadusername": "reginald.barclay"
    }
{% endhighlight %}
{:start="5"}
5. Click the big blue "Send" button and all being well you should see the response to your request in the bottom pane, in this case acknowledging the change.

<a class="image" href="{{site.baseurl}}/images/postman_jira_component.png" data-lightbox="image-1" data-title="Postman screenshot showing execution of JIRA PUT request">
<img src="{{site.baseurl}}/images/postman_jira_component.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>

BusinessObjects REST API
------------------------

BusinessObjects uses a different method for authenticating requests. Each request needs a logon token. Before you make a request to for example create a user or modify a universe, you need to make an initial request to get a logon token.

Requesting a logon token
========================

1. Where it says "Enter request URL" type in the url for the request, which should look something like this: `https://businessobjects.starfleet.com/biprws/logon/long`
2. Set the request type to POST as we're submitting information with this request.
3. Under the "Headers" tab add two key/value pairs for "Accept": "application/json" and "Content-Type": "application/json". This tell BusinessObjects that we are sending the body of the request formatted as JSON and we also want the response to be formatted as JSON. BusinessObjects will also accept and respond with XML, but I prefer JSON.
4. Under the "Body" tab change the type to "raw" and the format to "JSON" and enter the following with your username, password and the authentication type:
{% highlight json %}
    {
        "auth": "Enterprise",
        "userName": "jeanluc.picard",
        "password": "alphaalphathreezerofive"
    }
{% endhighlight %}
{:start="5"}
5. Click the big blue "Send" button and all being well you should see the response to your request in the bottom pane, in this case providing you with your logonToken.

<a class="image" href="{{site.baseurl}}/images/postman_businessobjects_logontoken.png" data-lightbox="image-1" data-title="Postman screenshot showing execution of BusinessObjects POST logon request">
<img src="{{site.baseurl}}/images/postman_businessobjects_logontoken.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>

Getting a list of users
=======================

1. Where it says "Enter request URL" type in the url for the request, which should look something like this: `https://businessobjects.starfleet.com/biprws/v1/users`
2. Set the request type to GET as we're just retrieving information with this request.
3. Under the "Headers" tab add a key/value pair for "Accept": "application/json" to tell BusinessObjects we want the response in JSON format.
4. Also under the "Headers" tab add a key called "X-SAP-LogonToken" with the value set to the logonToken from your token request.
5. Click the big blue "Send" button and all being well you should see the response to your request in the bottom pane. By default the system will only give you 50 users at a time. To get users beyond the first 50 you need to include a "page" paramater on your request, for example `https://businessobjects.starfleet.com/biprws/v1/users?page=2` to get the second 50 users. You can also change the default page size by including a pagesize parameter, for example `https://businessobjects.starfleet.com/biprws/v1/users?pagesize=100` to get 100 users at a time.

Creating a new user
===================

1. Where it says "Enter request URL" type in the url for the request, which should look something like this: `https://businessobjects.starfleet.com/biprws/v1/users/user`
2. Set the request type to POST as we're submitting information with this request.
3. Under the "Headers" tab add two key/value pairs for "Accept": "application/json" and "Content-Type": "application/json". This tell BusinessObjects that we want the response to be formatted as JSON and also that we are sending the body of the request as JSON.
4. Also under the "Headers" tab add a key called "X-SAP-LogonToken" with a value set to the logonToken from your token request.
5. Under the "Body" tab change the type to "raw" and the format to "JSON" and enter the following with your the parameters for the new account you want to create:
{% highlight json %}
    {
        "name": "reginald.barclay",
        "fullname": "Reginald Ednicott Barclay III",
        "description": "Engineer, First Class",
        "email": "reginald.barclay@starfleet.com",
        "password": "alphabetagammaonetwothree",
        "forcepasswordchange": True,
        "nameduser": False,
        "passwordexpire": True
    }
{% endhighlight %}
{:start="6"}
6. Click the big blue "Send" button and all being well you should see the response to your request in the bottom pane acknowledging that your new account has been created.

<a class="image" href="{{site.baseurl}}/images/postman_businessobjects_newuser.png" data-lightbox="image-1" data-title="Postman screenshot showing execution of BusinessObjects POST new user request">
<img src="{{site.baseurl}}/images/postman_businessobjects_newuser.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>

