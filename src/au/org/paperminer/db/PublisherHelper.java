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
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;

import au.org.paperminer.common.PaperMinerConstants;
import au.org.paperminer.common.PaperMinerException;


public class PublisherHelper 
{
    public static final String TABLE = "pm_publishers";
    public static final String ID = "id";
    public static final String TITLE = "title";
    public static final String PUB_DATE = "published";
    public static final String LAT = "latitude";
    public static final String LONG = "longitude";
    public static final String LOCN = "location";

    private HashMap<String, HashMap<String, String> > m_data = null;
    private Logger m_logger;
    
    /**
     * Fetch mined data for a TROVE Publisher from their TROVE ID
     */
    public PublisherHelper ()
    {
        m_logger = Logger.getLogger(PaperMinerConstants.LOGGER);
        m_data = new HashMap<String, HashMap<String, String> >();
    }
    
    /**
     * Get general Info about a publisher
     * @param id
     * @return info as JSON array using table column names as keys
     * @throws PaperMinerException
     */
    public String getInfo (String id) throws PaperMinerException
    {
    	String res = "";
    	HashMap<String, String> data = getRecord(id);
    	if (data != null) {
            JSONObject obj = new JSONObject();
            obj.putAll(data);
            res = obj.toString();
    	}
    	return res;
    }
    
    /**
     * Looks up a record by ID
     * @param id
     * @return Result set for search (you need to close it).
     * @throws PaperMinerException
     */
    private HashMap<String, String> getRecord (String id) throws PaperMinerException
    {
    	if (m_data.containsKey(id)) {
    		return (HashMap<String, String>)m_data.get(id);
    	}

    	Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            ps = con.prepareStatement("SELECT * FROM " + TABLE + " WHERE " + ID + " = '" + id + "'");
            ResultSet rs = ps.executeQuery();
	        if (rs.isBeforeFirst()) {
	            rs.next();
	            HashMap<String, String> tmp = new HashMap<String, String>();
	            tmp.put(TITLE, rs.getString(TITLE));
	            tmp.put(PUB_DATE, rs.getString(PUB_DATE));
	            tmp.put(LAT, rs.getString(LAT));
	            tmp.put(LONG, rs.getString(LONG));
	            tmp.put(LOCN, rs.getString(LOCN));
	            m_data.put(id, tmp);
	            rs.close();
	            m_logger.debug("Got lat/long for id=" + id + " (" + tmp.get(TITLE) + ")");
	            return tmp;
	        }
        }
        catch (SQLException ex) {
            m_logger.error("Error fetching lat/long for id=" + id, ex);
            throw new PaperMinerException("Fetch update failed, see log");
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
        return null;
    }
    
}

// EOF
