---
layout: post
title:  "eXist-db notes"
image: 
excerpt: ""
date:   2022-08-16 15:39:28
---

Some notes about eXist-db version 4.10 running on Windows Server 2016.

Installing eXist-db
===================

Download the JAR installer from [https://github.com/eXist-db/exist/releases/tag/eXist-4.10.0
](https://github.com/eXist-db/exist/releases/tag/eXist-4.10.0). You will also need Java VM version 1.8 or higher. You can download it [here](https://www.java.com/en/download/).

Run the JAR installer. By default the installer will want to install eXist-db to `c:\exist-db` with the data installed in `c:\eXist-db\webapp\WEB-INF\data`. You may want to change this to something like putting eXist-db in `c:\exist-4.10\db` and the data in `c:\exist-4.10\data` to separate the database software and your data.

Once the install completes run "Install eXist-db as Service" from the "eXist-db XML Database" Start menu folder to create a Windows service that will run the eXist-db software. The service will be set to automatic startup, so you'll need to start it manually the first time, or restart the server.

By default Jetty, the web server included with eXist-db, serves pages on port 8080. If your server has a firewall enabled you'll need to create an incoming rule allowing port 8080 in "Windows Firewall with Advanced Security".

For a number of tasks, restoring from a backup for example, you'll need to use the Java Admin Client. By default it'll be blocked for security reasons by Java, so to allow it to run open the Java control panel applet and add the URL for the admin client to the Exception Site List. It should be something like 
`http://servername:8080/exist/webstart/exist.jnlp`.

Backing up eXist-db database
============================

Visit the dashboard (`http://servername:8080/exist/apps/dashboard/index.html`) and open the "Backup" app. Click the "Trigger Backup" button, don't tick the "Zip" or "Incremental" boxes. A full backup can take minutes to run, but once complete the "Backup Central" dialog will update to list the backup. You will be able to find it a folder within the `data\export\` folder called something like `full20220819-1741`.

More: [https://exist-db.org/exist/apps/doc/backup](https://exist-db.org/exist/apps/doc/backup)

Restoring an eXist-db database backup
=====================================

Open the Java Admin Client mentioned above. Choose "Restore" from the Tools menu. Select a full backup zip file you want to restore. Or decrypt a full backup zip file and select the \_\_contents\_\_.xml file in the db folder within the decrypted files. You'll be prompted for credentials and then shown a progress dialog while the backup is restored.

After the restore is completed, you need to repair the package repository. The Admin Client will prompt you to repair it, but if that attempt fails you can run the following xquery in eXide.

{% highlight xquery %}

xquery version "3.1";

import module namespace repair="http://exist-db.org/xquery/repo/repair" 
at "resource:org/exist/xquery/modules/expathrepo/repair.xql";

repair:clean-all(),
repair:repair()
{% endhighlight %}

More: [https://exist-db.org/exist/apps/doc/backup#restore](https://exist-db.org/exist/apps/doc/backup#restore)

Exporting an application from eXist-db
======================================

If you want to keep your application code in version control or export it to another server, you need to export your application.

Visit the dashboard (`http://servername:8080/exist/apps/dashboard/index.html`) and open the "eXide - XQuery IDE" app. Use the "directory" panel on the left-hand side to navigate to the app you want to export and select one of the files. This should change the "Current app" in the top-right corner of eXide to your app. Then select Synchronize from the Application menu. This will present a dialog that lets you specify a target to export the files to.
