#!/bin/sh
#
# script backs up Paper Miner sql table data. The --no-create_info option prevents generation of Drop statements
# allowing tables to be modified before reloading into same columns (--complete-insert option).
#
# This should be set as a cron job, and used as required.
#
# Ron C.
#

mysqldump -u root -p paperminer --no-create-info --complete-insert --tables pm_users pm_admins pm_queries pm_audit > /tmp/pm_dumpfile.sql

