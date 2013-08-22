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
 */package au.org.paperminer.main;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Formatter;
import java.util.Locale;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import org.apache.log4j.Logger;

import au.org.paperminer.common.PaperMinerConstants;

/**
 * Constructs html menu div content depending on user status (from cookie)
 * @author Ron
 *
 */
public class MenuFilter implements Filter 
{
    private Logger m_logger;
    
    private final String MAIN_MENU =
        "<ul class=\"dropdown\">" +
         "<li><a onClick=\"goHome()\">Home</a></li>";
    
    private final String QUERY_SUBMENU =
         "<li><a onClick=\"#\">Query</a>" +
           "<ul class=\"sub-menu\">" +
             "<li class=\"%s\">%sNew%s</li>" +
             "<li class=\"%s\">%sCurrent%s</li>" +
             "<li class=\"%s\">%sSaved%s</li>" +
           "</ul>" +
           "</li>";
    
    private final String USER_SUBMENU =
        "<li><a onClick=\"#\">User</a>" +
           "<ul class=\"sub-menu\">" +
             "<li class=\"%s\">%sLogin or Register%s</li>" +
             "<li class=\"%s\">%sManage your details%s</li>" +
             "<li class=\"%s\">%sLogout%s</li>" +
          "</ul>" +
         "</li>";

    private final String VIEW_SUBMENU =
         "<li><a onClick=\"#\">View</a>" +
           "<ul class=\"sub-menu\">" +
           "<li class=\"%s\">%sMap%s</li>" +
           "<li class=\"%s\">%sHistogram%s</li>" +
           "<li class=\"%s\">%sTerm Cloud%s</li>" +
           "<li class=\"%s\">%sRaw Results%s</li>" +
          "</ul>" +
         "</li>";

    
    private final String HELP_SUBMENU =
         "<li><a onclick=\"#\">Help</a>" +
           "<ul class=\"sub-menu\">" +
             "<li><a onCLick=\"showHelp('about')\">About</a></li>" +
             "<li><a onCLick=\"showHelp('trove')\">Trove</a></li>" +
             "<li><a onCLick=\"showHelp('pm')\">Paper Miner</a></li>" +
             "<li><a onCLick=\"showHelp('rel')\">Read Release Notes</a></li>" +
           "</ul>" +
         "</li>";

    private final String STD_STUFF =
         "<li><a onClick=\"showPartners()\">Partners</a></li>" +
         "<li><a onCLick=\"showContacts()\">Contact</a></li>" +
        "</ul>";

            
    @Override
    public void init(FilterConfig arg0) throws ServletException 
    {
        m_logger = Logger.getLogger(PaperMinerConstants.LOGGER);
        m_logger.info("MenuFilter init");
    }

    @Override
    public void destroy()
    {
        // TODO Auto-generated method stub
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp,
        FilterChain filterChain) throws IOException, ServletException 
    {
        String html = null;
        int status = getUserStatus((HttpServletRequest) req);
        switch (status) {
        case 0: html = loginMenu();        break;
        case 1: html = notValidatedMenu(); break;
        case 2: html = validatedMenu();    break;
        case 3: html = loginMenu();        break;
        default: req.setAttribute(PaperMinerConstants.ERROR_PAGE, "u200");
        }
        
        if (html != null) {
            resp.setContentType("text/xml");
            PrintWriter pm = resp.getWriter();
            pm.write(html);
        }
        filterChain.doFilter(req, resp);
    }
        
    private int getUserStatus (HttpServletRequest req)
    {
        int status = 0;
    
        m_logger.info("retrieving user info");
        Cookie [] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(PaperMinerConstants.PM_COOKIE)) {
                    String [] values = cookie.getValue().split(",");
                    if (values.length >= 3) {
                        try {
                            status = Integer.parseInt(values[PaperMinerConstants.PMC_USER_STATUS]);
                            m_logger.debug("Status: " + values[PaperMinerConstants.PMC_USER_ID] + 
                                           ":" + values[PaperMinerConstants.PMC_USER_STATUS]);
                        }
                        catch (NumberFormatException ex) {
                            m_logger.error("Invalid status in cookie: " + values[PaperMinerConstants.PMC_USER_STATUS]);
                        }
                    }
                }
            }
        }
        return status;
    }
    
    /**
     * set div content when user needs to login, or register
     */
    private String loginMenu ()
    {
        StringBuilder sb = new StringBuilder(MAIN_MENU);
        Formatter formatter = new Formatter(sb, Locale.US);

        formatter.format(QUERY_SUBMENU, "greyed", "", "", 
						        		"greyed", "", "", 
						        		"greyed", "", "");
        formatter.format(VIEW_SUBMENU,  "greyed", "", "", 
						        	    "greyed", "", "", 
						        	    "greyed", "", "",
						        	    "greyed", "", "");
        formatter.format(USER_SUBMENU,  "active", "<a onClick=\"doLogin('open')\">", "</a>", 
						        	    "greyed", "", "", 
						        	    "greyed", "", "");
        formatter.close();
        
        sb.append(HELP_SUBMENU);
        sb.append(STD_STUFF);
        return sb.toString();
    }

    /**
     * set div content when user known, and email not validated
     */
    private String notValidatedMenu ()
    {
        StringBuilder sb = new StringBuilder(MAIN_MENU);
        Formatter formatter = new Formatter(sb, Locale.US);

        formatter.format(QUERY_SUBMENU, "active", "<a onClick=\"newQuery(true), resetQueryPane()\">", "</a>", 
						        		"active", "<a onCLick=\"currentQuery(true)\">", "</a>",  
						        		"greyed", "", "");
        formatter.format(VIEW_SUBMENU,  "active", "<a onCLick=\"showMap(true)\">", "</a>",
						        		"active", "<a onClick=\"showHistogram()\">", "</a>",
        								"active", "<a onClick=\"showCloud(true)\">", "</a>",
						        		"active", "<a onClick=\"showRawResults(true)\">", "</a>");
        formatter.format(USER_SUBMENU,  "greyed", "", "",
						        		"active", "<a onClick=\"doEditDetails()\">", "</a>",
						        		"active", "<a onClick=\"doLogout()\">", "</a>");
        formatter.close();
        
        sb.append(HELP_SUBMENU);
        sb.append(STD_STUFF);
        return sb.toString();
    }

    /**
     * set div content when user known, but email not validated
     */
    private String validatedMenu ()
    {
        StringBuilder sb = new StringBuilder(MAIN_MENU);
        Formatter formatter = new Formatter(sb, Locale.US);

        formatter.format(QUERY_SUBMENU, "active", "<a onClick=\"newQuery(true), resetQueryPane()\">", "</a>",
        		                        "active", "<a onCLick=\"currentQuery(true)\">", "</a>",
        		                        "active", "<a onCLick=\"showStoredQueries(true)\">", "</a>");
        formatter.format(VIEW_SUBMENU,  "active", "<a onCLick=\"showMap(true)\">", "</a>",
						                "active", "<a onClick=\"showHistogram(true)\">", "</a>",
						                "active", "<a onClick=\"showCloud(true)\">", "</a>",
        		                        "active", "<a onClick=\"showRawResults(true)\">", "</a>");
        formatter.format(USER_SUBMENU,  "greyed", "", "", 
        		                        "active", "<a onClick=\"doEditDetails()\">", "</a>",
        		                        "active", "<a onClick=\"doLogout()\">", "</a>");
        formatter.close();
        
        sb.append(HELP_SUBMENU);
        sb.append(STD_STUFF);
        return sb.toString();
    }
    
}
