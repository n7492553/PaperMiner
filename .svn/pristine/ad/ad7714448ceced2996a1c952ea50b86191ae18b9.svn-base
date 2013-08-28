INSERT IGNORE INTO pm_locations
  (name,state_code,country_code,latitude,longitude,box_nw_lat,box_nw_lng,box_se_lat,box_se_lng)
  SELECT 
  name,state_code,country_code,latitude,longitude,box_nw_lat,box_nw_lng,box_se_lat,box_se_lng
  FROM pm_tmp_loc;
    
INSERT IGNORE INTO pm_gs_refs (trove_id, location_id, frequency)
  SELECT a.trove_id, b.id, a.frequency 
  FROM pm_tmp a, pm_locations b 
    WHERE a.name = b.name
      AND a.country_code = b.country_code
      AND ((a.state_code = 0) OR (a.state_code = b.state_code));

