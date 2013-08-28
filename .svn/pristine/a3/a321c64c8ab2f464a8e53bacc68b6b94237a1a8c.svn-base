DELETE FROM pm_tmp;
DELETE FROM pm_tmp_loc;
DELETE FROM pm_tmp_strikeouts;


INSERT INTO pm_tmp (trove_id, name, state_code, country_code, frequency
SELECT a.trove_id, b.name, b.state_code, b.country_code, c.frequency
  FROM pm_audit a, pm_locations b, pm_gs_refs c
  WHERE (a.action = 'A' OR a.action = 'I')
    AND a.location_id = b.id
    AND c.trove_id = a.trove_id
    AND c.location_id = a.location_id;

INSERT INTO pm_tmp_loc (name, state_code, country_code, latitude, longitude, box_nw_lat, box_nw_lng, box_se_lat, box_se_lng)
SELECT a.name, a.state_code, a.country_code, a.latitude, a.longitude, a.box_nw_lat, a.box_nw_lng, a.box_se_lat, a.box_se_lng
  FROM pm_locations a, pm_audit b
  WHERE (b.action = 'A' OR b.action = 'I')
    AND a.id = b.location_id;

INSERT INTO pm_tmp_strikeouts (trove_id, name, state_code, country_code)
SELECT a.trove_id, b.name, b.state_code, b.country_code
  FROM pm_audit a, pm_locations b
  WHERE a.action = 'D'
    AND a.location_id = b.id;
    

    
    
UPDATE pm_gs_refs a, pm_tmp_strikeouts b, pm_locations c
   SET a.strikeout = 1
   WHERE a.trove_id = b.trove_id
     AND b.name = c.name
     AND b.state_code = c.state_code
     AND b.country_code = c.country_code
     AND a.location_id =  c.id;