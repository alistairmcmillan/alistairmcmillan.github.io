---
layout: post
title:  "Setting up a knowledge base using MediaWiki"
image: 
excerpt: ""
date:   2022-10-14 01:30:00
---

So lets say you want to set up a knowledge base using MediaWiki. Here's how you might do it on a Windows device.

Downloads
=========

First thing you'll need is the MediaWiki software itself, which you can [download here](https://www.mediawiki.org/wiki/Download).

You'll need a database server. They recommend MariaDB. The free community edition of MariaDB can be [downloaded here](https://mariadb.com/downloads/).

You'll need a web server and PHP interpreter. As of the current version of MediaWiki (version 1.38.4), although PHP version 8 is available, PHP version 7 is recommended. As PHP typically runs as a plugin within the Apache HTTPD server you need the Thread Safe version of PHP, and you also need to match the version of the Visual C compiler used to compile Apache and PHP. So download the relevant ZIP file for the "VS15 x64 Thread Safe" version of PHP from [here](https://windows.php.net/download#php-7.4), and look for the "Apache 2.4 binaries VS15" version of Apache and download it from [here](https://www.apachelounge.com/download/VC15/).

Depending on your version of Windows you may need to download the VS15 runtime. You can [download that here](https://www.microsoft.com/en-gb/download/details.aspx?id=48145).

Installing
==========

I like to set up a folder structure so you can install multiple versions of the software side by side. That way you can for example install an updated version of Apache alongside your current version of Apache, then easily turn off the old one and turn the new one on. So if there is a problem you can easily switch back to the old one.

First thing to do is create a folder called "c:\knowledgebase". Everything will be installed under this folder. Within that folder create sub folders called "bin", "data", "logs" and "www". In the bin folder create sub folders called "apache", "php" and "mariadb".

Extract the apache ZIP file, rename the Apache24 folder with the version number of the copy of Apache you downloaded to something like apache-2.4.54, and drop that folder inside the "c:\knowledgebase\bin\apache" folder so you end up with something like "c:\knowledgebase\bin\apache\apache-2.4.54".

Similarly extract the PHP zip file, and rename the folder to something like "php-7.4.32" and drop it into the folder structure so it sits at something like "c:\knowledgebase\bin\php\php-7.4.32".

Run the MariaDB installer. You only need the "MariaDB Server" component so you can disable "Development Components" and "Third party tools". Change the installation folder to something like "c:\knowledgebase\bin\mariadb\mariadb-10.9.3\". You'll be prompted for a root password; make sure to set something complex and secure, and keep a note of it. When you are prompted for the data directory point it to "c:\knowledgebase\data", this is to keep your database independent from a particular version of MariaDB. You can also change the name of the service to make it easier to identify the purpose and make it easier to install updates, for example "KB MariaDB 10.9.3".

Configuring Apache and PHP
==========================

We need to make some changes to the Apache configuration file. Open the httpd.conf that should be at "c:\knowledgebase\bin\apache\apache-2.4.54\conf\httpd.conf".

Look for the line near the beginning that starts "Define SRVROOT". It will likely say something like "c:/Apache24". Change it to say...

	Define SRVROOT "c:/knowledgebase/bin/apache/apache-2.4.54".

Then search for the line about half down the file that starts "DocumentRoot" and likely says "${SRVROOT}/htdocs" and change it to "c:/knowledgebase/www". Same with the following Directory line. So these two lines should look like...

    DocumentRoot "c:/knowledgebase/www"
    <Directory "c:/knowledgebase/www">

To keep logs for Apache separate from the version specific installations, look for the Log lines and modify them to something like... 

	ErrorLog "c:/knowledgebase/logs/error.log"

    CustomLog "c:/knowledgebase/logs/access.log" common

Or if you prefer the more complex "combined" log, comment out the "common" line and modify the "combined" line to look like...

    CustomLog "c:/knowledgebase/logs/access.log" combined

To tell Apache where to find PHP add the following line at the end of the Dynamic Shared Object (DSO) Support

	LoadModule php7_module "c:/knowledgebase/bin/php/php-7.4.32/php7apache2_4.dll"

Within the <IfModule mime_module> add the following lines so that Apache knows to send these files to the PHP interpreter.

	AddType application/x-httpd-php .php
	AddType application/x-httpd-phps .phps
	AddType application/x-httpd-php3 .php3 .phtml
	AddType application/x-httpd-php .html

PHP has it's own configuration file called php.ini. Within your PHP folder you should find a file called php.ini-production. Make a copy and rename it simply php.ini. Then update your Apache configuration by adding the following command at the end so that it knows where to find the php.ini file...

	PHPIniDir "C:/knowledgebase/bin/php/php-7.4.32"

MediaWiki requires a handful of PHP modules that aren't enabled by default. So within the php.ini file locate the following line and remove the semicolon to enable it...

	extension_dir = "ext"
	
Also uncomment the following lines to enable the required modules...

	extension=fileinfo
	extension=intl
	extension=mbstring
	extension=mysqli
	extension=openssl
	
The php install folder contains a number of DLL files that are required for the above modules to run, so we need to tell Windows where to find them. We do this by adding the following path to the system environment path.

	C:\knowledgebase\bin\php\php-7.4.32

One last change is to tell Apache to send all directory requests to an index.php or index.html rather than show people the content of folders. Look for the "Options Indexes FollowSymLinks" line in the "<Directory "c:/knowledgebase/www">" section and take out the word "Indexes" so it's just...

	Options FollowSymLinks

Also look for the <IfModule dir_module> section of the httpd.conf file and change the "DirectoryIndex" parameter to look like the following...

	DirectoryIndex index.php index.html

Now when Apache receives a request for something like http://localhost/wiki/ it will try to forward it to http://localhost/wiki/index.php, and if that doesn't work then http://localhost/wiki/index.html, and if that doesn't work it'll just show a "Forbidden" error instead of showing the content of the folder.

Before starting up the software it's a good idea to test your configuration files. You can do that by opening a regular Command Prompt and running the following command...

	c:\knowledgebase\bin\apache\apache-2.4.54\bin\httpd.exe -t

If all is well you'll get a "Syntax OK". If not hopefully you should get a descriptive error message that helps you locate the problem.

Setting up Windows service for Apache
=====================================

If you want your knowledgebase to start automatically when your Windows device is restarted, then you need to create services for Apache and MariaDB. The one for MariaDB should have been created during the installation of the software.

To create the service for Apache open a Command Prompt as administrator and run the following command. This command also changes the default service name from something like "Apache 2.4" to something a little more descriptive that tells us what it's for and includes the full version number.

    c:\knowledgebase\bin\apache\apache-2.4.54\bin\httpd.exe -k install -n "KB Apache 2.4.54"
    
Ideally know you should have the two services side by side when you check them in Computer Management.

	KB Apache 2.4.54
	KB MariaDB 10.9.3

Setting up the MediaWiki software
=================================

Unzip the mediawiki software into a folder called "wiki" in the c:\knowledgebase\www folder.

Then (at least on the same device you installed the software) you should be able to visit your install in a web browser at http://localhost/wiki/. You will hopefully see a message saying "LocalSettings.php not found" and giving you a link to set up your Mediawiki install. Click on that link and follow the prompts.

After setting the languages for your install, you'll then be given a number of suggestions for things you might like to install that will improve your install. You'll also be prompted for database details and a bunch of configuration options like naming your MediaWiki install. At the end of this you'll hopefully be given a LocalSettings.php file that you need to drop into your c:\knowledgebase\www\wiki folder.

At this point you should have a working wiki site! :D
