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

package au.org.paperminer.main;

import java.sql.Driver;
import java.sql.DriverManager;
import java.util.Enumeration;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

import au.org.paperminer.common.PaperMinerConstants;


public class PaperMinerListener implements ServletContextListener 
{

    private Logger m_logger = Logger.getLogger(PaperMinerConstants.LOGGER);

    @Override
    public void contextDestroyed (ServletContextEvent ev) 
    {
        try {
            Enumeration<Driver> drivers = DriverManager.getDrivers();
            while (drivers.hasMoreElements()) {
                DriverManager.deregisterDriver(drivers.nextElement());
            }
            m_logger.info("JDBC shutdown complete");
        } 
        catch (Exception ex) {
            m_logger.info("Exception caught while deregistering JDBC drivers", ex);
        }
        
        Set<Thread> threadSet = Thread.getAllStackTraces().keySet();
        Thread[] threadArray = threadSet.toArray(new Thread[threadSet.size()]);
        for (Thread t:threadArray) {
            if (t.getName().contains("Abandoned connection cleanup thread")) {
                synchronized(t) {
                    t.stop(); //don't complain, it works and we are shutting down anyway
                }
            }
        }
    }

    @Override
    public void contextInitialized (ServletContextEvent ev) 
    {
        ServletContext ctx = ev.getServletContext();
        String prefix = ctx.getRealPath("/");
        // set a system prop so the log4j configure will know where the logs go
        System.setProperty(PaperMinerConstants.PM_HOME, prefix);
        
        String file = ctx.getInitParameter(PaperMinerConstants.LOG_INIT_FILE);
        if (file == null) {
            System.err.println("Logging unavailable. Notify Administrator.");
        }
        else {
            PropertyConfigurator.configure(prefix + file);
            m_logger  = Logger.getLogger(PaperMinerConstants.LOGGER);
            m_logger.info("PaperMiner Logging started ok");
        }
    }

}
