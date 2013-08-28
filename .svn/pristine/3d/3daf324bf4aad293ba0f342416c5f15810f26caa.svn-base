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
import java.util.ArrayList;
import java.util.HashMap;
import org.apache.log4j.Logger;

import au.org.paperminer.common.PaperMinerConstants;
import au.org.paperminer.common.PaperMinerException;

/**
 * Helper class encapsulates persistence CRUD for a user and her stored queries.
 * @author Ron
 *
 */
public class UserHelper 
{
    public static final String USER_TABLE = "pm_users";
    public static final String ID = "id";
    public static final String EMAIL = "email";
    public static final String TROVE_KEY = "trove_key";
    public static final String STATUS = "status";
    public static final String CDATE = "date_created";

    public static final String QUERY_TABLE = "pm_queries";
    public static final String USER_ID = "user_id";
    public static final String DESCR = "descr";
    public static final String QUERY = "query";
    public static final String QUERY_TYPE = "query_type";
    public static final String COUNT = "total_last_run";
    public static final String RUN_DATE = "date_last_run";
    
    private HashMap<String, String> m_data = null;
    private Logger m_logger;
    
    public UserHelper ()
    {
        m_logger = Logger.getLogger(PaperMinerConstants.LOGGER);
    }
    
    public UserHelper (String id)
    {
        this();
        loadDataBy(ID, id);
    }
    
    public UserHelper (String email, String troveKey)
    {
        this();
        loadDataBy(EMAIL, email);
    }
    
    public boolean isKnownUser ()
    {
        return m_data != null;
    }
    
    /**
     * creates a new PaperMiner user with default status and the current date/time.
     * @throws PaperMinerException
     */
    public void createUser (String email, String troveKey) throws PaperMinerException
    {
        Connection con = null;
        PreparedStatement ps = null;
        String sql = "INSERT INTO " + USER_TABLE +
                " (" + EMAIL + "," + TROVE_KEY + "," + CDATE + ") VALUES ('" +
                 email + "','" + troveKey + "','" + new java.sql.Date(System.currentTimeMillis()) + "')";
        
        if ((email == null) || (troveKey == null)) {
            throw new PaperMinerException("Null email or key");
        }

        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
;            ps = con.prepareStatement(sql);
            int res = ps.executeUpdate();
            if (res != 1) {
                throw new PaperMinerException("Insert failed for " + email);
            }
        }
        catch (SQLException ex) {
            m_logger.error("Error creating user " + email, ex);
            throw new PaperMinerException("User create failed, see log");
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
        
        loadDataBy(EMAIL, email);
    }
   
    /**
     * Loads data by a key value
     * @param column Either id, email, or trove key
     * @param value value for column
     */
    private void loadDataBy (String column, String value)
    {
        Connection con = null;
        ResultSet rs = null;
        PreparedStatement ps = null;

        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            ps = con.prepareStatement("SELECT * FROM " + USER_TABLE + " WHERE " + column + "='" + value + "'");
            rs = ps.executeQuery();
            if (rs.isBeforeFirst()) {
                rs.next();
                m_data = new HashMap<String, String>();
                m_data.put(ID, Integer.toString(rs.getInt(ID)));
                m_data.put(EMAIL, rs.getString(EMAIL));
                m_data.put(TROVE_KEY, rs.getString(TROVE_KEY));
                m_data.put(STATUS, rs.getString(STATUS));
            }
        }
        catch (SQLException ex) {
            m_logger.error("Error retrieving user data for " + column + "=" + value, ex);
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
    }
    
    /**
     * Returns value for user attribute
     * @param key DB column alias
     * @return value for key
     */
    public String get (String key)
    {
        return m_data.get(key);
    }
    
    /**
     * Returns value for user attribute
     * @param key DB column alias
     * @return value for key
     */
    public void set (String key, String value)
    {
        if (! (key.equals(ID) || key.equals(CDATE)) ) {
            m_data.put(key, value);
        }
    }
    
    /**
     * Updates mutable user data
     * @throws PaperMinerException
     */
    public void update () throws PaperMinerException
    {
        Connection con = null;
        PreparedStatement ps = null;
        String sql = "UPDATE " + USER_TABLE + " SET " +
                     EMAIL + "='" + m_data.get(EMAIL) + "', " + 
                     TROVE_KEY + "='" + m_data.get(TROVE_KEY) + "', " + 
                     STATUS + "='" + m_data.get(STATUS) + "' WHERE " + 
                     ID + "='" + m_data.get(ID) + "'";
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            ps = con.prepareStatement(sql);
            int res = ps.executeUpdate();
            if (res != 1) {
                throw new PaperMinerException("Update failed for user id=" + m_data.get(ID));
            }
        }
        catch (SQLException ex) {
            m_logger.error("Error updating user id=" + m_data.get(ID), ex);
            throw new PaperMinerException("User update failed, see log");
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
    }
    
    /**
     * Check is the users quota of stored queries has been reached
     * @return True if a save is permitted
     * @throws PaperMinerException
     */
    public boolean canSaveQuery () throws PaperMinerException
    {
    	boolean res = false;
        Connection con = null;
        ResultSet rs = null;
        PreparedStatement ps = null;
        String id = m_data.get(ID);
        
        try {
        	int quota = -1;
        	int total = 0;
	        String sql1 = "SELECT MAX_QUERIES FROM " + USER_TABLE + " WHERE " + ID + "='" + id + "'";
	        String sql2 = "SELECT count(*) FROM " + QUERY_TABLE + " WHERE USER_ID='" + id + "'";
	        con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
	        
	        ps = con.prepareStatement(sql1);
	        rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	            rs.next();
	            quota = rs.getInt(1);
	        }
	        ps.close();
	        
	        ps = con.prepareStatement(sql2);
	        rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	            rs.next();
	            total = rs.getInt(1);
	        }

	        res = total < quota;
	        m_logger.debug("Quota="+quota+" Total="+total+" res="+res);
        }
        catch (SQLException ex) {
            m_logger.error("Error checking quota for user id=" + id, ex);
            throw new PaperMinerException("Quota check failed, see log");
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
        return res;
    }
    
    /**
     * Checks for duplicate queries
     * @param descr
     * @param query
     * @param qType
     * @return True if query is a duplicate
     * @throws PaperMinerException
     */
    public boolean savedQueryExists (String descr, String query, String qType) throws PaperMinerException
    {
    	int count = 0;
        Connection con = null;
        ResultSet rs = null;
        PreparedStatement ps = null;
        String id = m_data.get(ID);
        
        try {
	        String sql = "SELECT count(*) FROM " + QUERY_TABLE +
	   		     " WHERE " + USER_ID + "='" + id + "'" +
			     "   AND " + DESCR + "='" + descr + "'" +
			     "   AND " + QUERY + "='" + query + "'" +
			     "   AND " + QUERY_TYPE + "='" + qType + "'";
	        con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
	        ps = con.prepareStatement(sql);
	        rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	            rs.next();
	            count = rs.getInt(1);
	        }
	        m_logger.debug("Exist count="+count);

        }
        catch (SQLException ex) {
            m_logger.error("Error checking quota for user id=" + id, ex);
            throw new PaperMinerException("Quota check failed, see log");
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
        return count > 0;
    }
    
    /**
     * Saves a user query.
     * @param descr
     * @param query
     * @param qType
     * @param total
     * @return True on success
     * @throws PaperMinerException
     */
    public boolean saveQuery (String descr, String query, String qType, int total) throws PaperMinerException
    {
    	int res = 0;
        Connection con = null;
        PreparedStatement ps = null;
        String id = m_data.get(ID);
        
        try {
	        String sql = "INSERT INTO " + QUERY_TABLE + 
	        		     " (" + USER_ID + "," + DESCR + "," + QUERY + "," + QUERY_TYPE + "," + COUNT + "," + RUN_DATE + ") VALUES" +
	        		     " (" + m_data.get(ID) + ",'" + descr + "','" + query + "','" + qType + "'," + total + ",NOW())";
	        m_logger.debug(sql);
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            ps = con.prepareStatement(sql);
            res = ps.executeUpdate();
        }
        catch (SQLException ex) {
            m_logger.error("Error checking quota for user id=" + id, ex);
            throw new PaperMinerException("Quota check failed, see log");
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
        return res != 0;
    }
    
    /**
     * Creates an array of hashmaps of user query data.
     * @return list of maps.
     * @throws PaperMinerException
     */
    public ArrayList<HashMap <String, String>> getSavedQueries () throws PaperMinerException
    {
    	ArrayList<HashMap <String, String>> list = new ArrayList<HashMap <String, String>>();
        Connection con = null;
        ResultSet rs = null;
        PreparedStatement ps = null;
        String id = m_data.get(ID);
        
        try {
	        String sql = "SELECT * FROM " + QUERY_TABLE + " WHERE " + USER_ID + "='" + m_data.get(ID) + "'";
	        m_logger.debug(sql);
	        con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
	        
	        ps = con.prepareStatement(sql);
	        rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
		        while (rs.next()) {
			    	HashMap<String, String> map = new HashMap<String, String>();
			    	map.put(ID, Integer.toString(rs.getInt(ID)));
			    	map.put(DESCR, rs.getString(DESCR));
			    	map.put(QUERY, rs.getString(QUERY));
			    	map.put(QUERY_TYPE, rs.getString(QUERY_TYPE));
			    	map.put(COUNT, Integer.toString(rs.getInt(COUNT)));
			    	map.put(CDATE, rs.getString(CDATE));
			    	map.put(RUN_DATE, rs.getString(RUN_DATE));
			    	list.add(map);
		        }
	        }
        }
        catch (SQLException ex) {
            m_logger.error("Error getting queries for user id=" + id, ex);
            throw new PaperMinerException("Quota check failed, see log");
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
        m_logger.debug("Found " + list.size() + " Stored queries user id=" + id);
        return list;
    }
    
    /**
     * Deletes one or more stored queries.
     * @param csvVal A single query ID, or csv list of IDs.
     * @return Number of queries deleted
     * @throws PaperMinerException
     */
    public int deleteStoredQueries (String csvVal) throws PaperMinerException
    {
    	int count = 0;
        Connection con = null;
        PreparedStatement ps = null;
        String id = m_data.get(ID);
        
        try {
	        String sql = "DELETE FROM " + QUERY_TABLE + " WHERE " + ID + 
	        		     ((csvVal.indexOf(",") > 0) ? " IN (" + csvVal + ")" : "=" + csvVal);
	        m_logger.debug(sql);
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            ps = con.prepareStatement(sql);
            count = ps.executeUpdate();
        }
        catch (SQLException ex) {
            m_logger.error("Error deleting query (" + csvVal + ") for user id=" + id, ex);
            throw new PaperMinerException("Delete stored query failed, see log");
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
        return count;
    }
    
} // EOF

