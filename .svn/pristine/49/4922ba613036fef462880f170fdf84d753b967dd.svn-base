#!/bin/sh
#
# Script assumes the table has been created and you have cd'd to the checkout sql directory
#
# v1.0 2013-02-13  RC
#

 mysqlimport -u root -p --fields-terminated-by="\t" --local --delete paperminer pm_publishers.txt
 mysqlimport -u root -p --fields-terminated-by="\t" --local --delete paperminer pm_au_states.txt
 mysqlimport -u root -p --fields-terminated-by="\t" --local --delete paperminer pm_ccodes.txt

