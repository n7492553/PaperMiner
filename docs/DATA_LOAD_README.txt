                    LOADING THE PAPERMINER DATABASE
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The mysql tables are dropped and created by the TableMaker class if and only if the number of expected
tables in the mysql "paperminer" sql database is less than the number expected by TableMaker.  This is
checked when the first user access takes place after the servlet is started.  So to recreate the tables,
go in and manually drop a table, redeploy the war file, then try to access the service.

Ugly, so we may get an admin interface, eventually.



Loading the Tables
~~~~~~~~~~~~~~~~~~

the dev and prod machines both run  a cron job to dump the contents of the user tables nightly.
The shell script is called bkupsql.sh and a copy resides in the bin directory of the checkout.
Copy it to /usr/local/sbin and set cron appropriately. It creates /tmp/pm_dunpfile.sql and may also
be run manually at any time.  Note it has a hardcoded root database password (sorry...)

  Restoring the User tables
  ~~~~~~~~~~~~~~~~~~~~~~~~~
  
  Execute the following:
  
    $ mysql -u root -p paperminer < /tmp/pm_dumpfile.sql
    
  The default password is secret.  The password for mysql user pmpool is SecretSanta7.
  You will need to respond with this when running this (and other) scripts.
  
  
  Restoring the Fixed Tables
  ~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  The sql directory of the checkout contains data files to load the fixed data tables. 
  You must cd to the sql directory of the checkout and enter:
  
    $ sh load_fixed.sh
    
  You will be asked for the root password three time as the three tables are loaded.
  
  
  Loading the Locations Tables
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  This depends on what the raw data files are named.  The process is two step:
  
  1.  Preprocess a the raw data to generate files corresponding to the temporary sql tables
      using a perl script bin/gssplit.pl. This generates:
        - pm_tmp.txt
        - pm_tmp_loc.txt      
  2.  Load the txt files into the tmp tables, and merge them into the working tables with
      the sql script, sql/load_locations.sh
  
  Step (1) is uses a perl script held in the bin dir of the checkout.  If you have multiple raw
  data files, it's a good idea to aggregate them using cat.  
  Say they are all in pm.data off your home dir:
  
    $ cat ~/pm.data/*txt > ~/pm_data/all.txt
    
  The sql/load_locations.sh script expects it's input to be in the checkout sql directory,
  so assuming you are still in the sql dir of the chekout, run the perl script as follows:
  
    $ ../bin/gssplit.pl -i ~/pm.data/all.txt -o .
    
  This creates the files mentioned in (1) above in the same dir as the load script.
  Now issue:
  
    $ sh load_locations.sh
    
  You will be asked for the mysql root password three times.
  
NOTE WELL
~~~~~~~~~
  
The load_* scripts do not do a delete, so if necessary, delete all rows of the following before you start:
  
Fixed tables:
    pm_publications
    pm_au_states
    pm_ccodes
    
Location Tables:
    pm_gs_refs
    pm_locations
    
The temporary tables are deleted before being loaded:
    pm_tmp
    pm_tmp_loc
    
    
    
Preserving User Adds, Inserts, and Deletes
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
Changes made to pm_locations and pm_gs_refs are tracked in the pm_audit table.
If purging and reloading the location tables, it is important to preserve these edits
first.  Scripts are provided for this too.
  
  <DETAILS TO BE SUPPLIED>
  
  
  
  
                                                                        Ron
                                                                        2013-02-21
                                                                        

