---
layout: post
title:  "Inconsistent datatypes errors in BusinessObjects"
image: 
excerpt: ""
date: 2026-07-15 00:37:00
---

Trying to refresh a BusinessObjects Web Intelligence report I was getting the following error:

> ```The following database error ocurred: ORA-00932: inconsistent datatypes: expected - got CLOB. For information about this error, please refer to SAP Knowledge Base Article 2054721 on the SAP Support Portal. (IES 10901).```

That SAP KB article was a dead end.

I hadn't heard of CLOB so had to look that up.

> ```[CLOB - A character large object containing single-byte or multibyte characters. Both fixed-width and variable-width character sets are supported, both using the database character set. Maximum size is (4 gigabytes - 1) * (database block size).](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/Data-Types.html)```

> ```[SQL:1999 has four new data types (although one of them has some identifiable variants). The first of these types is the LARGE OBJECT, or LOB, type. This is the type with variants: CHARACTER LARGE OBJECT (CLOB) and BINARY LARGE OBJECT (BLOB). CLOBs behave a lot like character strings, but have restrictions that disallow their use in PRIMARY KEYs or UNIQUE predicates, in FOREIGN KEYs, and in comparisons other than purely equality or inequality tests.](https://www.cl.cam.ac.uk/teaching/0304/Databases/sql1999.pdf)```

Guessing that the problem here is the size of the data being returned, one solution is just to truncate the amount of data. This could be done at the Universe level, but that could affect other reports built on the same Universe, so for this one report I switched the affected query to "Custom SQL" and added a substr() function around the object to pare it down to a reasonable size, and placed that inside a to_char() function to cast the shortened object as a regular char string. Like so...

{% highlight sql %}
    to_char(dbms_lob.substr(CAPTAINS_LOG_TEXT))
{% endhighlight %}

Now the report refreshes without any error.
