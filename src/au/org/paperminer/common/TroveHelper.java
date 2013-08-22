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
 */package au.org.paperminer.common;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.log4j.Logger;

/**
 * Wrapper hides complexity of making Trove API calls
 * @author Ron
 *
 */
public class TroveHelper 
{
    private final String m_key;
    
    private Logger m_logger;
    
    public TroveHelper (String troveKey)
    {
        m_key = troveKey;
        m_logger = Logger.getLogger(PaperMinerConstants.LOGGER);
    }
    
    /**
     * Uses a relatively inexpensive and fast Trove call to validate a key
     * @return true if key is valid
     */
    public boolean isValidKey ()
    {
        boolean res = false;
        URL url = null;
        HttpURLConnection con = null;
        try {
            url = new URL("http://api.trove.nla.gov.au/newspaper/titles?key=" + m_key);
            con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.getContent();
            int code = con.getResponseCode();
            m_logger.debug("key check code=" + code);
            res = (code == 200);
        }
        catch (MalformedURLException ex) {
            m_logger.info("Can't happen", ex);
        }
        catch (IOException ex) {
            m_logger.info("Error testing trove key " + m_key, ex);
        }
        finally {
            if (con != null) {
                con.disconnect();
            }
        }
        return res;
    }
    
}
