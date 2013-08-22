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

package au.org.paperminer.common;

import java.sql.SQLException;
import org.apache.log4j.Logger;
import org.apache.commons.dbcp.*;
import org.apache.commons.pool.impl.GenericObjectPool;

import au.org.paperminer.db.TableMaker;

import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.http.HttpServlet;


/**
 * Base class for all servlets provided override of the init() method that
 * checks all required resources are available and ready for use.
 * @author chernich
 */
public abstract class AbstractServlet
    extends HttpServlet
    implements PaperMinerConstants
{
    private static final long serialVersionUID = 1L;

    protected Logger m_logger = null;
    private PoolingDriver m_poolDriver = null;


    /**
     * Check all application wide services required to be available
     * before request servicing can proceed.
     * @exception javax.servlet.UnavailableException Do not start application
     */
    public void init () throws ServletException
    {
        m_logger = Logger.getLogger(LOGGER);
        if (! testConnectionPool()) {
            throw new UnavailableException("Database unavailable. Notify Administrator.");
        }
    }
    
    @Override
    public void destroy ()
    {
           if (m_poolDriver != null) {
            try {
                m_poolDriver.closePool("pm");
            }
            catch (SQLException ex) {
                 m_logger.error("Error closing pool", ex);
            }
        }
       }
    
    private boolean testConnectionPool ()
    {
        boolean res = false;
        String dbDriver = getInitParameter("jdbc.driver.class");
        String dbUrl = getInitParameter("db.url");
        String dbUser = getInitParameter("db.user");
        String dbPass = getInitParameter("db.passwd");

        try {
            m_logger.debug("DB init class="+dbDriver+", url="+dbUrl+", user="+dbUser+" pwd="+dbPass.substring(0,3)+"...");
            Class.forName(dbDriver);
            GenericObjectPool connectionPool = new GenericObjectPool(null);
            ConnectionFactory connectionFactory = new DriverManagerConnectionFactory(dbUrl, dbUser, dbPass);
            PoolableConnectionFactory poolableConnectionFactory = new PoolableConnectionFactory(connectionFactory, connectionPool, null, null, false, true);
            m_poolDriver = new PoolingDriver();
            m_poolDriver.registerPool(POOL_NAME, connectionPool);
            //Connection conn = DriverManager.getConnection("jdbc:apache:commons:dbcp:/poolconf");
            TableMaker.checkCreateTables(false);
            res = true;
            m_logger.info("Connection pool started ok");
        }
        catch (ClassNotFoundException ex) {
            m_logger.error("DB Driver registration failed for " + dbDriver, ex);
        }
        catch (PaperMinerException ex) {
            m_logger.error("Connection pool check failed", ex);
        }
        return res;
    }
    

}

// EOF

