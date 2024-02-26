---
layout: post
title:  "Fun and games with Java keystores"
image: 
excerpt: ""
date:   2024-02-22 17:00:00
---

<style type="text/css">
    h1 { font-size: 35px }
    h2 { font-size: 25px !important }
</style>

This is my understanding of how to create a Java keystore containing signed certificates. There may be better, smarter ways of doing this, but this method worked for me.

# Step 1 - Create your keystore

> ```keytool -genkey -alias starfleet -keyalg RSA -keystore keystore.jks -keysize 2048```

This command generates a public/private key pair for your domain wrapped up inside a Java keystore file.

You'll be prompted for a number of parameters like country code, and organization. The most important is "first and last name" which strangely enough is the domain name you need the certificates for, in my example "starfleet.ufp.com".

<a class="image" href="{{site.baseurl}}/images/Certificate generating.png" data-lightbox="image-1" data-title="Example of running the keytool -genkey command">
<img src="{{site.baseurl}}/images/Certificate generating.png" style="width:500px;" /></a>

# Step 2 - Generate a certificate signing request

> ```keytool -certreq -alias starfleet -keystore keystore.jks -file starfleet.csr```

The above command generates a certificate signing request (CSR) file that you send to your certificate authority (CA).

Now you have a keystore with a public/private key pair for your server, but if you use this keystore browsers will warn visitors to your server that your connection is "potentially insecure" as the certificate is "self-signed". So you create a CSR that you send off to a CA, who sign it, thus telling browsers that it can be trusted.

# Step 3 - Import your signed certificate

When your CA sends back your signed certificate they can send it in a number of formats. Sometimes you'll get your certificate and the intermediate certificate that was used to sign it in the same file (sometimes called a certificate chain file). Sometimes they'll be in separate files. A quirk of keytool is that it can only import certificate chain files if they are in PKCS#7 format (these usually have a p7b file extension).

So there are different methods to import your signed certificate and any associated certificates...

## Option 1 - Import a p7b certificate chain

> ```keytool -importcert -alias starfleet -trustcacerts -file starfleet.p7b -keystore keystore.jks```

This command will let you import a cert chain (which contains your certificate and any certificates used to sign it in one file) into your keystore. The alias must match the alias you used at the start when you generated your public/private key pair.

If this works successfully keytool will say "Certificate reply was installed in keystore".

<a class="image" href="{{site.baseurl}}/images/Certificate p7b reply import.png" data-lightbox="image-1" data-title="Example of importing a certificate reply from a certificate authority">
<img src="{{site.baseurl}}/images/Certificate p7b reply import.png" style="width:500px;" /></a>

And you're done. If you run the ```keytool -list -keystore keystore.jks``` command you should just see one entry for your certificates.

<a class="image" href="{{site.baseurl}}/images/Certificate p7b done.png" data-lightbox="image-1" data-title="Example of importing a certificate reply from a certificate authority">
<img src="{{site.baseurl}}/images/Certificate p7b done.png" style="width:500px;" /></a>

## Option 2 - Import individual certificates

> ```keytool -import -trustcacerts -alias root -file root.crt -keystore keystore.jks```

> ```keytool -import -trustcacerts -alias interm2 -file interm2.crt -keystore keystore.jks```

> ```keytool -import -trustcacerts -alias interm1 -file interm1.crt -keystore keystore.jks```

> ```keytool -import -trustcacerts -alias starfleet -file starfleet.crt -keystore keystore.jks```

If your certificates are in separate files, you can import them with the above commands. Again, the alias for your signed certificate must match the alias you used at the start when you generated your public/private key pair.

You may not need to import the root certificate; it may already be present within your operating system. Keytool will ask you to confirm whether you want it in the keystore if it is already present in the operating system.

Once you run those commands you'll be done. If you run the ```keytool -list -keystore keystore.jks``` command you'll see multiple entries for your certificates, unlike the single entry when you.

# Other notes

## How to see what is inside a keystore

> ```keytool -list -keystore keystore.jks```

## Convert JKS keystore to PKCS keystore

> ```keytool -importkeystore -srckeystore keystore.jks -destkeystore keystore.p12 -deststoretype PKCS12 -srcalias ABCD1234 -deststorepass YOURPASSWORD -destkeypass YOURPASSWORD```

## Convert PKCS keystore to JKS keystore

> ```keytool -importkeystore -srckeystore keystore.p12 -destkeystore keystore.jks -deststoretype JKS -srcalias ABCD1234 -deststorepass YOURPASSWORD -destkeypass YOURPASSWORD```

## Separating certificates into separate files

> ```keytool -printcert -file certificates.pem```

If you've been sent a handful of certificate files and you aren't sure what's in each file, you can run the above command and it will list the contents. It will output tons of information though, so you may want to run the following command to simplify the output to just the information you need.

> ```keytool -printcert -file certificates.pem | grep Owner```

This should give you one line for each certificate in the file, which tells you what is in the file and the order that they're in. Something like this...

<a class="image" href="{{site.baseurl}}/images/Certificate printcert.png" data-lightbox="image-1" data-title="Example of listing the contents of a certificate chain file">
<img src="{{site.baseurl}}/images/Certificate printcert.png" style="width:500px;" /></a>

Then you can open the file in a simple text editor like Notepad, and copy and paste each certificate into its own file. Each certificate will be marked with a "-----BEGIN CERTIFICATE-----" marker at the start and a "-----END CERTIFICATE-----" at the end. Make sure to grab the two markers and all the gibberish in between when you are copying and pasting.

<a class="image" href="{{site.baseurl}}/images/Certificate pem format.png" data-lightbox="image-1" data-title="Example of the contents of a certificate chain file">
<img src="{{site.baseurl}}/images/Certificate pem format.png" style="width:500px;" /></a>

Once you have your certificates in separate files you can use the instructions above under the "Option 2" heading to import them into your keystore.
