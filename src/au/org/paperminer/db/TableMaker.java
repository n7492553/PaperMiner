/*
 * Copyright (c) 2013 The University of Queensland. This software is being developed 
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;

import au.org.paperminer.common.PaperMinerConstants;
import au.org.paperminer.common.PaperMinerException;

public class TableMaker 
{
    private static final String PM_USERS =
        "CREATE TABLE pm_users (" +
        "  id             MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT," +
        "  email          VARCHAR(60) NOT NULL," +
        "  trove_key      VARCHAR(20) NOT NULL," +
        "  status         TINYINT NOT NULL DEFAULT 1," +
        "  max_queries    TINYINT UNSIGNED NOT NULL DEFAULT 20," +
        "  max_scheduled  TINYINT UNSIGNED NOT NULL DEFAULT 5," +
        "  ttl_days       SMALLINT UNSIGNED NOT NULL DEFAULT 90," +
        "  date_created   DATE NOT NULL,"+
        "  PRIMARY KEY (id)" +
        ")";
    private static final String PM_QUERIES =
        "CREATE TABLE pm_queries (" +
        "  id             MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT," +
        "  user_id        MEDIUMINT UNSIGNED NOT NULL," +
        "  query          VARCHAR(256) NOT NULL," +
        "  descr          VARCHAR(60) NOT NULL," +
        "  query_type     CHAR(1) NOT NULL," +
        "  total_last_run MEDIUMINT UNSIGNED NOT NULL," +
        "  date_last_run  DATETIME,"+
        "  date_created   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
        "  PRIMARY KEY (id)," +
        "  CONSTRAINT FOREIGN KEY (user_id) REFERENCES pm_users (id) ON DELETE CASCADE," +
        "  INDEX (user_id)" +
        ")";		
    private static final String PM_ADMINS =
        "CREATE TABLE pm_admins (" +
        "  user_id        MEDIUMINT UNSIGNED NOT NULL," +
        "  is_primary     TINYINT UNSIGNED NOT NULL DEFAULT 0," +
        "  date_created   DATE NOT NULL,"+
        "  PRIMARY KEY (user_id)," +
        "  CONSTRAINT FOREIGN KEY (user_id) REFERENCES pm_users (id) ON DELETE CASCADE" +
        ")";
    private static final String PM_AUDIT =
        "CREATE TABLE pm_audit (" +
        "  user_id        MEDIUMINT UNSIGNED NOT NULL," +
        "  trove_id       INT UNSIGNED," +
        "  location_id    MEDIUMINT UNSIGNED," +
        "  action         CHAR(1) NOT NULL," +
        "  date_created   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
        "  PRIMARY KEY (user_id, date_created)" +
        ")";
    private static final String PM_PUBLISHERS =
        "CREATE TABLE pm_publishers (" +
        "  id             MEDIUMINT UNSIGNED NOT NULL," +
        "  title          VARCHAR(164) NOT NULL," +
        "  published      VARCHAR(12) NOT NULL," +
        "  latitude       VARCHAR(16) NOT NULL," +
        "  longitude      VARCHAR(16) NOT NULL," +
        "  location       VARCHAR(32) NOT NULL," +
        "  PRIMARY KEY (id)" +
        ")";	
    private static final String PM_LOCATIONS =
        "CREATE TABLE pm_locations (" +
        "  id             MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT," +
        "  name           VARCHAR(64) NOT NULL," +
        "  state_code     TINYINT UNSIGNED," +
        "  country_code   SMALLINT UNSIGNED NOT NULL," +
        "  latitude       DECIMAL(12,9) NOT NULL," +
        "  longitude      DECIMAL(12,9) NOT NULL," +
        "  box_nw_lat     DECIMAL(12,9)," +
        "  box_nw_lng     DECIMAL(12,9)," +
        "  box_se_lat     DECIMAL(12,9)," +
        "  box_se_lng     DECIMAL(12,9)," +
        "  date_created   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
        "  PRIMARY KEY (id)," +
        "  UNIQUE INDEX (name,state_code,country_code)" +
        ")";		
    private static final String PM_AU_STATES =
        "CREATE TABLE pm_au_states (" +
        "  id             TINYINT UNSIGNED NOT NULL," +
        "  short_name     CHAR(3)," +
        "  long_name      VARCHAR(30) NOT NULL," +
        "  PRIMARY KEY (id)" +
        ")";
    private static final String PM_CCODES =
        "CREATE TABLE pm_ccodes (" +												// 8
        "  id             SMALLINT UNSIGNED NOT NULL," +
        "  short_name     CHAR(2)," +
        "  long_name      VARCHAR(64) NOT NULL," +
        "  PRIMARY KEY (id)" +
        ")";
    private static final String PM_GS_REFS =
        "CREATE TABLE pm_gs_refs (" +
        "  trove_id       INT UNSIGNED NOT NULL," +
        "  location_id    MEDIUMINT UNSIGNED NOT NULL," +
        "  strikeout      TINYINT UNSIGNED NOT NULL DEFAULT 0," +
        "  frequency      SMALLINT UNSIGNED NOT NULL DEFAULT 0," +
        "  date_created   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
        "  PRIMARY KEY (trove_id, location_id)," +
        "  CONSTRAINT FOREIGN KEY (location_id) REFERENCES pm_locations (id) ON DELETE CASCADE" +
        ")";		
    private static final String PM_TMP =
        "CREATE TABLE pm_tmp (" +
        "  trove_id       INT UNSIGNED NOT NULL," +
        "  name           VARCHAR(64) NOT NULL," +
        "  state_code     TINYINT UNSIGNED," +
        "  country_code   SMALLINT UNSIGNED NOT NULL," +
        "  frequency      SMALLINT UNSIGNED NOT NULL DEFAULT 0," +
        "  PRIMARY KEY (trove_id,name,state_code,country_code)" +
        ")";
    private static final String  PM_TMP_LOC =
        "CREATE TABLE pm_tmp_loc (" +
        "  name           VARCHAR(64) NOT NULL," +
        "  state_code     TINYINT UNSIGNED," +
        "  country_code   SMALLINT UNSIGNED NOT NULL," +
        "  latitude       DECIMAL(12,9) NOT NULL," +
        "  longitude      DECIMAL(12,9) NOT NULL," +
        "  box_nw_lat     DECIMAL(12,9)," +
        "  box_nw_lng     DECIMAL(12,9)," +
        "  box_se_lat     DECIMAL(12,9)," +
        "  box_se_lng     DECIMAL(12,9)," +
        "  PRIMARY KEY (name,state_code,country_code)" +
        ")";
    /*
    private static final String PM_TMP_STRIKEOUT =
        "CREATE TABLE pm_tmp_strikeouts (" +
        "  trove_id       INT UNSIGNED NOT NULL," +
        "  name           VARCHAR(64) NOT NULL," +
        "  state_code     TINYINT UNSIGNED," +
        "  country_code   SMALLINT UNSIGNED NOT NULL," +
        "  PRIMARY KEY (trove_id,name,state_code,country_code)" +
        ")";
    */
    
    private final static String [] DROP_ORDER = { 
    	PM_TMP_LOC, PM_TMP, PM_GS_REFS, PM_LOCATIONS, PM_CCODES, PM_AU_STATES, PM_PUBLISHERS, PM_AUDIT, PM_ADMINS, PM_QUERIES, PM_USERS,
	};
	//PM_TMP_STRIKEOUT, PM_TMP_LOC, PM_TMP, PM_GS_REFS, PM_LOCATIONS, PM_CCODES, PM_AU_STATES, PM_PUBLISHERS, PM_AUDIT, PM_ADMINS, PM_QUERIES, PM_USERS,
    private final static String [] CREATE_ORDER = { 
    	PM_CCODES, PM_AU_STATES, PM_LOCATIONS, PM_GS_REFS, PM_TMP_LOC, PM_TMP, PM_PUBLISHERS, PM_USERS, PM_AUDIT, PM_ADMINS, PM_QUERIES, // PM_TMP_STRIKEOUT,
	};
    	
    
    /**
     * (Re) creates all required database tables if one or more don't exist, or "force" is set.
     * CAUTION: if one or more exist, they will be DROPPED, so BACKUP data before deploying the war file
     * after making a change to the table data!!
     * @param force Drop all and recreate
     * @throws PaperMinerException
     */
    public static final void checkCreateTables (boolean force) throws PaperMinerException
    {
        Logger logger = Logger.getLogger(PaperMinerConstants.LOGGER);
        
        Connection con = null;
        Statement ps = null;
        try {
            con = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + PaperMinerConstants.POOL_NAME);
            ps = con.createStatement();
            if (force || ! tableCountCheck(con, logger)) {
                logger.debug("Recreating database schema");
                Pattern pat = Pattern.compile("CREATE\\s+TABLE\\s+(pm_.+?)\\s.*");
                for (int idx = 0; idx < DROP_ORDER.length; idx++) {
                    Matcher mat = pat.matcher(DROP_ORDER[idx]);
                    if (mat.matches()) {
                        String sql = "DROP TABLE IF EXISTS " + mat.group(1);
                       	ps.execute(sql);
                        logger.debug("Dropped " + mat.group(1));
                    }
                }
                for (int idx = 0; idx < CREATE_ORDER.length; idx++) {
                    Matcher mat = pat.matcher(CREATE_ORDER[idx]);
                    if (mat.matches()) {
                        //logger.debug(CREATE_ORDER[idx]);
                        ps.execute(CREATE_ORDER[idx]);
                    	logger.info("Created table " + mat.group(1));
                    }
                }
            }
        }
        catch (SQLException ex) {
            logger.error("SQL error during table creation", ex);
            throw new PaperMinerException("SQL error during table creation", ex);
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
                    logger.warn("SQL error during cleanup", ex);
                }
            }
        }
    }
    
    /**
     * Checks if database table count matches the expected count
     * @param con Connection to use
     * @param logger
     * @return true if count is correct
     * @throws PaperMinerException
     */
    private static final boolean tableCountCheck (Connection con, Logger logger) throws PaperMinerException
    {
        boolean res = false;
        ResultSet rs = null;
        PreparedStatement ps = null;
        try {
            ps = con.prepareStatement("SHOW TABLES LIKE 'pm_%'");
            rs = ps.executeQuery();
            int tableCount = 0;
            while (rs.next()) {
                ++tableCount;
            }
            //logger.info("Table count=" + tableCount);
            res = ! (tableCount < CREATE_ORDER.length);
        }
        catch (SQLException ex) {
            throw new PaperMinerException("Failure during table count check", ex);
        }
        finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (ps != null) {
                    ps.close();
                }
            }
            catch (SQLException ex) {
                logger.warn("Problem closing connection", ex);
            }
        }
        return res;
    }

}

// EOF
