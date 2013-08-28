/* Copyright (c) 2013 The University of Queensland. This software is being developed 
 * for the UQ School of History, Philosophy, Religion and Classics (HPRC).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package au.org.paperminer.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.log4j.Logger;

import au.org.paperminer.common.PaperMinerConstants;
import au.org.paperminer.common.PaperMinerException;


public class LocationHelper
{
    public static final String LOCN_TABLE = "pm_locations";
    public static final String LOCN_ID = "id";
    public static final String LOCN_NAME = "name";
    public static final String LOCN_STATE_CODE = "state_code";
    public static final String LOCN_CNTRY_CODE = "country_code";
    public static final String LOCN_LAT = "latitude";
    public static final String LOCN_LON = "longitude";
    public static final String LOCN_NW_LAT = "box_nw_lat";
    public static final String LOCN_NW_LON = "box_nw_lng";
    public static final String LOCN_SE_LAT = "box_se_lat";
    public static final String LOCN_SE_LON = "box_se_lng";
    public static final String LOCN_CDATE = "date_created";
    
    public static final String GS_TABLE = "pm_gs_refs";
    public static final String GS_TROVE_ID = "trove_id";
    public static final String GS_LOCN_ID = "location_id";
    public static final String GS_STRIKEOUT = "strikeout";
    public static final String GS_FREQ = "frequency";
    public static final String GS_CDATE = "date_created";
    
    public static final String AU_TABLE = "pm_au_states";
    public static final String AU_ID = "id";
    public static final String AU_SNAME = "short_name";
    public static final String AU_LNAME = "long_name";
    
    public static final String ISO_CN_TABLE = "pm_ccodes";
    public static final String ISO_CN_ID = "id";
    public static final String ISO_CN_SNAME = "short_name";
    public static final String ISO_CN_LNAME = "long_name";

    public static final String AUDIT_TABLE = "pm_audit";
    public static final String AUDIT_USER_ID = "user_id";
    public static final String AUDIT_TROVE_ID = "trove_id";
    public static final String AUDIT_LOCN_ID = "location_id";
    public static final String AUDIT_ACTION = "action";

    private Logger m_logger;

    
    public LocationHelper ()
    {
        m_logger = Logger.getLogger(PaperMinerConstants.LOGGER);
    }
    
    /**
     * Create a two dimension String array for a TROVE reference ID.
     * @param ref TROVE ID
     * @return array [<pm location id>,<count of location in referenced TROVE OCR data>] 
     * @throws PaperMinerException
     */
    public ArrayList<ArrayList<String>> getLocationsForRef (String ref) throws PaperMinerException
    {
    	ArrayList<ArrayList<String>> info = null;
    	Connection con = null;
        PreparedStatement ps = null;
        
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
    		String sql = "SELECT " + GS_LOCN_ID +"," + GS_FREQ + " FROM " + GS_TABLE + 
            		" WHERE " + GS_TROVE_ID + " = " + ref + " AND " + GS_STRIKEOUT + " = 0";
            ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	        	info = new ArrayList<ArrayList<String>>();
	            while (rs.next()) {
	            	ArrayList<String> tmp = new ArrayList<String>();
		            tmp.add(Integer.toString(rs.getInt(GS_LOCN_ID)));
		            tmp.add(Integer.toString(rs.getInt(GS_FREQ)));
		            info.add(tmp);
	            }
	            rs.close();
	        }
        }
        catch (SQLException ex) {
            m_logger.error("Error fetching GS data for TROVE id=" + ref, ex);
            throw new PaperMinerException("Fetch GS data failed, see log");
        }
        finally {
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }
        return info;
    }

    /**
     * Create a map of location property names and values for a PM location ID.
     * @param id PM location ID
     * @return Location property data
     * @throws PaperMinerException
     */
    public HashMap<String, String> getLocationInfo (String id) throws PaperMinerException
    {
    	HashMap<String, String> map = new HashMap<String, String>();
    	Connection con = null;
        PreparedStatement ps = null;
        
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            String sql = 
            	"SELECT " + LOCN_NAME + "," + LOCN_LAT + "," + LOCN_LON + 
            	"," + LOCN_NW_LAT + "," + LOCN_NW_LON + "," + LOCN_SE_LAT + "," + LOCN_SE_LON + 
        		"," + LOCN_STATE_CODE + "," + LOCN_CNTRY_CODE +
        		" FROM " + LOCN_TABLE + 
        		" WHERE " + LOCN_ID + " = " + id;
            ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	            rs.next();
                map.put(LOCN_NAME, rs.getString(1));
				map.put(LOCN_LAT, Double.toString(rs.getDouble(2)));
				map.put(LOCN_LON, Double.toString(rs.getDouble(3)));
				map.put(LOCN_NW_LAT, Double.toString(rs.getDouble(4)));
				map.put(LOCN_NW_LON, Double.toString(rs.getDouble(5)));
				map.put(LOCN_SE_LAT, Double.toString(rs.getDouble(6)));
				map.put(LOCN_SE_LON, Double.toString(rs.getDouble(7)));
	            
	            String stateCode = rs.getString(8);
	            String cntryCode = rs.getString(9);
	            
	            rs.close();
	
	            if (stateCode.equals("0")) {
		            map.put("state_sn", "");
		            map.put("state_ln", "");
		        }
		        else {
		            sql = "SELECT " + AU_SNAME + "," + AU_LNAME +
		    		      " FROM " + AU_TABLE + " WHERE " + AU_ID + "=" + stateCode;
		            rs = ps.executeQuery(sql);
			        if (rs.isBeforeFirst()) {
			            rs.next();
			            map.put("state_sn", rs.getString(1));
			            map.put("state_ln", rs.getString(2));
			        }
		            rs.close();
		        }
	            
	            if (cntryCode.equals("0")) {
		            map.put("iso_sn", "");
		            map.put("iso_ln", "");
		        }
		        else {
		            sql = "SELECT " + ISO_CN_SNAME + "," + ISO_CN_LNAME +
		    		      " FROM " + ISO_CN_TABLE + " WHERE " + ISO_CN_ID + "=" + cntryCode;
		            rs = ps.executeQuery(sql);
			        if (rs.isBeforeFirst()) {
			            rs.next();
			            map.put("iso_sn", rs.getString(1));
			            map.put("iso_ln", rs.getString(2));
			        }
		            rs.close();
		        }
	        }
        }
        catch (SQLException ex) {
            m_logger.error("Error fetching GS data for TROVE id=" + id, ex);
            throw new PaperMinerException("Fetch GS data failed, see log");
        }
        finally {
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }
    	return map;
    }
    
    /**
     * Marks pm_gs_refs entries as deleted.
     * @param userId ID of user making the change
     * @param locnList list of location codes
     * @param troveId TROVE id to qualify location codes
     * @return Number of records changed
     * @throws PaperMinerException
     */
    public int strikeout (String userId, String locnList, String troveId) throws PaperMinerException
    {
    	int res = 0;
    	boolean doCommit = true;
    	Connection con = null;
        Statement ps = null;
        
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            con.setAutoCommit(false);
            
            ps = con.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_UPDATABLE);
            ps.execute("START TRANSACTION;");
            
            String sql = "UPDATE " + GS_TABLE + " SET " + GS_STRIKEOUT + "=1" +
                         " WHERE " + GS_TROVE_ID + "=" + troveId +
                         "   AND " + GS_LOCN_ID +  " IN (" + locnList + ");";
            res = ps.executeUpdate(sql);
            m_logger.debug("locations struckout: " + res + " Auto commit=" + con.getAutoCommit());
        	String [] ids = locnList.split(",");
        	for (int i = 0; i < ids.length; i++) {
        		addAuditEntry(ps, userId, troveId, ids[i], "D");
        	}
        }
        catch (SQLException ex) {
        	doCommit = false;
            m_logger.error("Error updating data TROVE/Locn " + troveId + '/' + locnList, ex);
            throw new PaperMinerException("Strikeout GS entry failed, see log");
        }
        finally {
        	try {
	        	if (doCommit) {
	        		con.commit();
	        	}
	        	else {
	                m_logger.debug("rolling back location strikeout");
	        		con.rollback();
	        	}
	        	ps.close();
        	}
        	catch (SQLException ex) {
                m_logger.error("Error during commit/rollback " + troveId + '/' + locnList, ex);
        	}
        	
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }
    	return res;
    }
    
    /**
     * Inserts a reference to an existing location into the GS table
     * @param userId User requesting the insert
     * @param troveId Related trove ID
     * @param locationId the existing location ID
     * @param frequency number of times the location is referenced in the TROVE record
     * @param auditAction A|I
     * @return true for success
     * @throws PaperMinerException
     */
    public boolean addReference (String userId, String troveId, String locationId, String frequency, String auditAction)
    	throws PaperMinerException
    {
    	boolean res = false;
    	boolean doCommit = true;
    	Connection con = null;
        Statement ps = null;
        
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            con.setAutoCommit(false);
            
            ps = con.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_UPDATABLE);
            ps.execute("START TRANSACTION;");
            
            String sql = "INSERT INTO " + GS_TABLE + " (" + GS_TROVE_ID + "," + GS_LOCN_ID + ',' + GS_FREQ + ") VALUES (" + 
            			 troveId + ',' + locationId + ',' + frequency + ");";
            int cnt = ps.executeUpdate(sql);
            if (cnt != 1) {
            	doCommit = false;
            	throw new PaperMinerException("Unable to add GS location");
            }
            else {
	            m_logger.debug("GS entry inserted. Auto commit=" + con.getAutoCommit());
	    		addAuditEntry(ps, userId, troveId, locationId, auditAction);
	    		res = true;
            }
        }
        catch (SQLException ex) {
        	doCommit = false;
            m_logger.error("Error inserting GS data TROVE/Locn/freq " + troveId + '/' + locationId + '/' + frequency, ex);
            throw new PaperMinerException("Strikeout GS entry failed, see log");
        }
        finally {
        	try {
	        	if (doCommit) {
	        		con.commit();
	        	}
	        	else {
	                m_logger.debug("rolling back location strikeout");
	        		con.rollback();
	        	}
	        	ps.close();
        	}
        	catch (SQLException ex) {
                m_logger.error("Error during commit/rollback " + troveId, ex);
        	}
        	
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }    	
        return res;
    }
    
    public int addLocation (String userId, String troveId, String frequency, HashMap<String, String>map)
    		throws PaperMinerException
    {
    	boolean doCommit = true;
    	Connection con = null;
    	ResultSet rs = null;
        Statement ps = null;
        int locnId  = 0;
    	int stateId = 0;
    	int cntryId = 0;
        
        try {
            m_logger.debug("addLocation params " + map.get("name") + ',' + map.get("state_sn") + ',' + map.get("cntry_ln") + 
            		',' + map.get("lat") +',' + map.get("lng") +',' + map.get("nw_lat") +',' + map.get("nw_lng") +',' + map.get("se_lat") +',' + map.get("se_lng") +cntryId);
        	stateId = getStateIdFromShortName(map.get("state_sn"));
        	cntryId = getCntryIdFromLongName(map.get("cntry_ln"));
        	locnId = getLocationId(map.get("name"), stateId, cntryId);
            m_logger.debug("Insert location for " + map.get("state_sn") + "=" + stateId + ',' + map.get("cntry_ln") + "=" + cntryId + " exists=" + locnId);

            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            con.setAutoCommit(false);
            
            ps = con.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_UPDATABLE);
            ps.execute("START TRANSACTION;");
            if (locnId == 0) {
	            String sql = "INSERT INTO " + LOCN_TABLE + " (" + 
	                	LOCN_NAME + "," + LOCN_LAT + "," + LOCN_LON + 
	                	"," + LOCN_NW_LAT + "," + LOCN_NW_LON + "," + LOCN_SE_LAT + "," + LOCN_SE_LON + 
	            		"," + LOCN_STATE_CODE + "," + LOCN_CNTRY_CODE + ") VALUES ('" +
	                	map.get("name") + "','" + map.get("lat") + "','" + map.get("lng") + "','" + 
	                	map.get("nw_lat") + "','" + map.get("nw_lng") + "','" + map.get("se_lat") + "','" + map.get("se_lng") + "','" + 
	                	stateId + "','" + cntryId + "')";
	            		
	        	int cnt = ps.executeUpdate(sql, Statement.RETURN_GENERATED_KEYS);
	            m_logger.debug("Insert location returned " + cnt);
	        	rs = ps.getGeneratedKeys();
		        if (rs.isBeforeFirst()) {
		            rs.next();
		            locnId = rs.getInt(1);
		            m_logger.debug("New location id=" + locnId);
		        }
	            rs.close();
            }
        	
            if (locnId != 0) {
            	doCommit = addReference(userId, troveId, Integer.toString(locnId), frequency, "I");
            }
            else {
            	doCommit = false;
	            m_logger.debug("Insert location failed");
	            throw new PaperMinerException ("Insert location failed");
            }
        }
        catch (SQLException ex) {
        	doCommit = false;
            m_logger.error("Error inserting new location " + map.get("name") + '/' + stateId + '/' + cntryId, ex);
            throw new PaperMinerException("Strikeout GS entry failed, see log");
        }
        finally {
        	try {
	        	if (doCommit) {
	        		con.commit();
	        	}
	        	else {
	                m_logger.debug("rolling back location insert");
	        		con.rollback();
	        	}
	        	ps.close();
        	}
        	catch (SQLException ex) {
                m_logger.error("Error during commit/rollback " + troveId, ex);
        	}
        	
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }    	
        return locnId;
    }
        
    /**
     * Locates locations matching a name, optionally with a (short) state name and/or a (long) country name.
     * @param locnName  Place name
     * @param stateSName Short State name
     * @param cntryLName Long country name
     * @return List of location maps (same content as getLocationInfo)
     * @throws PaperMinerException
     */
    public ArrayList<HashMap<String, String>> locationsLike (String locnName, String stateSName, String cntryLName) throws PaperMinerException
    {
    	Connection con = null;
        Statement ps = null;
        ResultSet rs = null;
    	ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
        
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            ps = con.createStatement();
        	StringBuffer sb = new StringBuffer(
	        	"SELECT " + LOCN_ID + "," + LOCN_NAME + "," + LOCN_LAT + "," + LOCN_LON + 
	        	"," + LOCN_NW_LAT + "," + LOCN_NW_LON + "," + LOCN_SE_LAT + "," + LOCN_SE_LON + 
	    		"," + LOCN_STATE_CODE + "," + LOCN_CNTRY_CODE +
	    		" FROM " + LOCN_TABLE + 
	    		" WHERE " + LOCN_NAME + " like '" + locnName + "'"
    		);
        	
        	if (stateSName.length() > 0) {
        		String sql = "SELECT " + AU_ID + ',' + AU_LNAME + " FROM " + AU_TABLE + " WHERE " + AU_SNAME + " like '" + stateSName + "'";
        		rs = ps.executeQuery(sql);
        		m_logger.debug(sql + "  RES=" + ps.getFetchSize());
		        if (rs.isBeforeFirst()) {
		            rs.next();
		            sb.append(" AND " + LOCN_STATE_CODE + "='" + rs.getString(AU_ID) + "'");
		        }
	            rs.close();
        	}
        	
        	if (cntryLName.length() > 0) {
        		String sql = "SELECT " + ISO_CN_ID + " FROM " + ISO_CN_TABLE + " WHERE " + ISO_CN_LNAME + " like '" + cntryLName + "'";
        		rs = ps.executeQuery(sql);
        		m_logger.debug(sql + "  RES=" + ps.getFetchSize());
		        if (rs.isBeforeFirst()) {
		            rs.next();
		            sb.append(" AND " + LOCN_CNTRY_CODE + "='" + rs.getString(ISO_CN_ID) + "'");
		        }
	            rs.close();
        	}
            
        	rs = ps.executeQuery(sb.toString());
	        if (rs.isBeforeFirst()) {
	            while (rs.next()) {
	            	HashMap<String, String> map = new HashMap<String, String>();
		            map.put(LOCN_ID, Integer.toString(rs.getInt(LOCN_ID)));
		            map.put(LOCN_NAME, rs.getString(LOCN_NAME));
					map.put(LOCN_LAT, Double.toString(rs.getDouble(LOCN_LAT)));
					map.put(LOCN_LON, Double.toString(rs.getDouble(LOCN_LON)));
					map.put(LOCN_NW_LAT, Double.toString(rs.getDouble(LOCN_NW_LAT)));
					map.put(LOCN_NW_LON, Double.toString(rs.getDouble(LOCN_NW_LON)));
					map.put(LOCN_SE_LAT, Double.toString(rs.getDouble(LOCN_SE_LAT)));
					map.put(LOCN_SE_LON, Double.toString(rs.getDouble(LOCN_SE_LON)));
					
					String [] snames = getStateNames(rs.getInt(LOCN_STATE_CODE));
					String [] cnames = getCountryNames(rs.getInt(LOCN_CNTRY_CODE));
		            map.put("state_sn", snames[0]);
		            map.put("state_ln", snames[1]);
		            map.put("iso_sn", cnames[0]);
		            map.put("iso_ln", cnames[1]);
		            list.add(map);
	            }
	            rs.close();
	        }
            m_logger.debug("found " + list.size() + " locations");
        }
        catch (SQLException ex) {
        	String msg = "Error finding location " + locnName;
            m_logger.error(msg, ex);
            throw new PaperMinerException(msg + ", see log");
        }
        finally {
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }
    	return list;
    }
    
    /**
     * Return array [short name, long name] for an Australian state ID
     * @param id State
     * @return array [short name, long name]
     * @throws PaperMinerException
     */
    private String [] getStateNames (int id) throws PaperMinerException
    {
    	String [] info = { "", "", };
    	Connection con = null;
        PreparedStatement ps = null;
        
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
    		String sql = "SELECT " + AU_SNAME + ',' + AU_LNAME + " FROM " + AU_TABLE + " WHERE " + AU_ID + "=" + id;
            ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	            rs.next();
	            info[0] = rs.getString(1);
	            info[1] = rs.getString(2);
	            rs.close();
	        }
        }
        catch (SQLException ex) {
            m_logger.error("Error fetching state data for id=" + id, ex);
            throw new PaperMinerException("Fetch state name data failed, see log");
        }
        finally {
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }
        return info;    
    }
    
    /**
     * Return array [short name, long name] for a country ID
     * @param id Country
     * @return array [short name, long name]
     * @throws PaperMinerException
     */
    private String [] getCountryNames (int id) throws PaperMinerException
    {
    	String [] info = { "", "", };
    	Connection con = null;
        PreparedStatement ps = null;
        
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
    		String sql = "SELECT " + ISO_CN_SNAME + ',' + ISO_CN_LNAME + " FROM " + ISO_CN_TABLE + " WHERE " + ISO_CN_ID + "=" + id;
            ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	            rs.next();
	            info[0] = rs.getString(1);
	            info[1] = rs.getString(2);
	            rs.close();
	        }
        }
        catch (SQLException ex) {
            m_logger.error("Error fetching country data for id=" + id, ex);
            throw new PaperMinerException("Fetch state name data failed, see log");
        }
        finally {
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }
        return info;    
    }
    
    /**
     * Get ID of Australian state from short name
     * @param sn State abbreviation
     * @return ID or zero
     * @throws PaperMinerException
     */
    private int getStateIdFromShortName (String sn)
    		throws PaperMinerException
    {
    	int id = 0;
    	Connection con = null;
        PreparedStatement ps = null;
        
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
    		String sql = "SELECT " + AU_ID + " FROM " + AU_TABLE + " WHERE " + AU_SNAME + " LIKE '" + sn + "'";
            ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	            rs.next();
	            id = rs.getInt(1);
	            rs.close();
	        }
	        ps.close();
            m_logger.debug("Got state id " + id + " for " + sn);
        }
        catch (SQLException ex) {
            m_logger.error("Error fetching state ID for sname=" + sn, ex);
            throw new PaperMinerException("Fetch state ID data failed, see log");
        }
        finally {
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }
        return id;    
    }  
    
    /**
     * Get country codes from country long name 
     * @param ln
     * @return ID or zero
     * @throws PaperMinerException
     */
    private int getCntryIdFromLongName (String ln)
    		throws PaperMinerException
    {
    	int id = 0;
    	Connection con = null;
        PreparedStatement ps = null;
        
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
    		String sql = "SELECT " + ISO_CN_ID + " FROM " + ISO_CN_TABLE + " WHERE " + ISO_CN_LNAME + " LIKE '" + ln + "'";
            ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	            rs.next();
	            id = rs.getInt(1);
	            rs.close();
	        }
	        ps.close();
            m_logger.debug("Got country id " + id + " for " + ln);
       }
        catch (SQLException ex) {
            m_logger.error("Error fetching state ID for sname=" + ln, ex);
            throw new PaperMinerException("Fetch state ID data failed, see log");
        }
        finally {
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }
        return id;    
    }
    
    /**
     * Get location ID by name, state id, and country id
     * @param name
     * @param stateId
     * @param cntryId
     * @return Location id or zero
     * @throws PaperMinerException
     */
    private int getLocationId (String name, int stateId, int cntryId)
    		throws PaperMinerException
    {
    	int id = 0;
    	Connection con = null;
        PreparedStatement ps = null;
        
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
    		String sql = "SELECT " + LOCN_ID + " FROM " + LOCN_TABLE + " WHERE " + 
                    LOCN_NAME + " LIKE '" + name + "' AND " +
            		LOCN_STATE_CODE + "=" + stateId + " AND " +
    				LOCN_CNTRY_CODE + "=" + cntryId;
            ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	            rs.next();
	            id = rs.getInt(1);
	            rs.close();
	        }
	        ps.close();
            m_logger.debug("Got location id " + id + " for " + name + '/' + stateId + '/' + cntryId);
        }
        catch (SQLException ex) {
            m_logger.error("Error fetching location id for " + name + '/' + stateId + '/' + cntryId, ex);
            throw new PaperMinerException("Fetch state ID data failed, see log");
        }
        finally {
            if (con != null) {
                try {
                    con.close();
                    if (ps != null) {
                        ps.close();
                    }
                }
                catch (SQLException ex) {
                    m_logger.warn("SQL error during cleanup", ex);
                }
            }
        }
        return id;    
    }
    
    /**
     * Adds an entry to the audit table (as part of a TRANSCTION)
     * @param ps An open SQL statement
     * @param userId User making change
     * @param troveId Related trove ID, or zero
     * @param locationId Location ID
     * @param action One of [D,A,I] (delete, add, insert)
     * @throws SQLException
     */
    private void addAuditEntry (Statement ps, String userId, String troveId, String locationId, String action)
    	throws SQLException
    {
		String sql = "INSERT INTO " + AUDIT_TABLE + " (" + 
                     AUDIT_USER_ID +  "," + AUDIT_TROVE_ID + "," + AUDIT_LOCN_ID + "," + AUDIT_ACTION + 
                     ") VALUES ('" +
				     userId + "','" + troveId + "','" + locationId + "','" + action + "');";
        m_logger.debug("addAuditEntry: " + sql);
        ps.execute(sql);
    }
    
    
    
}

// EOF

