            Building the PaperMiner Server
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            

Building the PaperMiner WAR file
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
For convenience and reliability, PaperMiner is built using a stand-alone Ant build script
(ie, it is totally independent of any IDE and can be automatically built, configured, and
deployed from the command line in a Subversion checkout).

The default Ant built script (build.xml) is NOT part of the checkout.
It is created by the Ant script "configure.xml" from the top level of a Subversion checkout
by issuing the following command:

    $ ant -f configure.xml

This will create the script in the checkout root, configured for the local environment.
To build the WAR file, issue:

    $ ant

This will compile and configure as required, placing the output (PaperMaker.war)
in the top level build directory.  Note that the directories build, classes, and tmp
are set to SVN:ignore and should never be checked in; neither should .classpath, but
I've forgotten how to mark that as "ignore".

Mostly, use the target:

    $ ant deploy.local

This does the above, plus copies the war file to the appropriate Tomcat webapps location
in the context of the dev, prod, and Ron's home test environments.

For other usable Ant tasks, see the configured build.xml file comments.


To ensure the Build number is set correctly, issue a:

    $ ant clean

before

    $ ant deploy.local


CAUTION! 
~~~~~~~~
Always issue a "clean" by itself.
IE, bad things will happen if you issue an "ant clean all".

VIP!
On the production machine (paperminer.org.au), we need to deploy the war file as ROOT,
and a few other things.  This is taken care of by the build.xml AS CONFIGURED by configure.xml
BUT--this depends on two environment variables being set on the production box and ONLY ON the
production box (repeat after me three times...)

These are:

    HOSTNAME=paperminer.org.au
    PRODUCTION=1

These can be set (export...) in the users .profile, or better still, in /etc/bash.bashrc

They cause:
  1.  the war file to be deployed as ROOT.war
  2.  <base href=...> in the index.html to be set to the root
  3.  the paperminer URI path in pm.js to be set for ROOT access on tomcat
  
If PaperMiner is ever moved, be sure to set these env vars for the production host.



Building the Utilities
~~~~~~~~~~~~~~~~~~~~~~

    $ ant util

Compiles the utility classes placing the class files in <HOME>/classes



Bugs and Limitations
~~~~~~~~~~~~~~~~~~~~
The configure.xml file at present contains hardcoded paths for the Tomcat libraries,
dependent on the OS. These really should be located in a more reliable way and I may 
get around to that, someday.


							                         Ron C
							                         2013-01-08
							                         Updated 2013-04021

