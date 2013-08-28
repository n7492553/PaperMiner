#!/bin/sh
#
# Loads pm_locations and pm_tmp, then inserts references into pm_gs_refs.
# Script assumes the table has been created and you have cd'd to the checkout sql directory
#
# v1.0 2013-03-14  RC
#

 mysqlimport -u root -p --fields-terminated-by="\t" --local --delete \
    --columns=name,state_code,country_code,latitude,longitude,box_nw_lat,box_nw_lng,box_se_lat,box_se_lng \
    paperminer pm_tmp_loc.txt
  
 mysqlimport -u root -p --fields-terminated-by="\t" --local --delete \
    --columns=trove_id,name,state_code,country_code,frequency \
    paperminer pm_tmp.txt
  
 mysql -u root -p paperminer < cr_gs_refs.sql

