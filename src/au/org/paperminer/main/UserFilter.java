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

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Properties;
import java.util.regex.Pattern;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.MimeMessage;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import au.org.paperminer.common.CookieHelper;
import au.org.paperminer.common.PaperMinerConstants;
import au.org.paperminer.common.PaperMinerException;
import au.org.paperminer.common.TroveHelper;
import au.org.paperminer.db.UserHelper;

import org.apache.log4j.Logger;
import org.json.simple.JSONValue;

/**
 * Does registration of new users and "authentication" of existing ones.
 * @author Ron
 */
public class UserFilter implements Filter
{
    private Logger m_logger;
    private String m_serverName;
    
    @Override
    public void init(FilterConfig config) throws ServletException 
    {
        m_logger = Logger.getLogger(PaperMinerConstants.LOGGER);
        m_logger.info("AddUserFilter init");
        ServletContext ctx = config.getServletContext();
        m_serverName = ctx.getInitParameter("server-name");
        m_logger.debug("Server=" + m_serverName);
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
        m_logger.info("userFilter doFilter");
        
        HttpServletRequest httpReq = (HttpServletRequest) req;
        String remoteReq = httpReq.getRequestURL().toString();
        int idx = remoteReq.lastIndexOf('/');
        if (remoteReq.substring(idx).startsWith("/opn")) {
            m_logger.debug(" userFilter open");
            openUser(req, resp);
        }
        else if (remoteReq.substring(idx).startsWith("/info")) {
            m_logger.debug(" userFilter user info");
            getPrefs((HttpServletRequest) req, (HttpServletResponse) resp);
        }
        else if (remoteReq.substring(idx).startsWith("/add")) {
            m_logger.debug(" userFilter add");
            addUser(req, resp);
        }
        else if (remoteReq.substring(idx).startsWith("/cls")) {
            m_logger.debug(" userFilter close");
            removeCookie((HttpServletResponse) resp);
        }
        else if (remoteReq.substring(idx).startsWith("/vfy")) {
            m_logger.debug(" userFilter verify");
            setStatus(PaperMinerConstants.USER_VALIDATED, req, resp);
        }
        else if (remoteReq.substring(idx).startsWith("/mod")) {
            m_logger.debug(" userFilter modify");
            updateUser((HttpServletRequest) req, (HttpServletResponse) resp);
        }
        else if (remoteReq.substring(idx).startsWith("/qsave")) {
            m_logger.debug(" userFilter save query");
            saveQuery((HttpServletRequest) req, (HttpServletResponse) resp);
        }
        else if (remoteReq.substring(idx).startsWith("/qget")) {
            m_logger.debug(" userFilter get queries");
            getQueryData((HttpServletRequest) req, (HttpServletResponse) resp);
        }
        else if (remoteReq.substring(idx).startsWith("/qdel")) {
            m_logger.debug(" userFilter delete query");
            deleteQuery((HttpServletRequest) req, (HttpServletResponse) resp);
        }
        filterChain.doFilter(req, resp);
        return;
    }
    
    /**
     * Loads info about an existing PM user into a session cookie
     * @param req
     * @param resp
     */
    private void openUser (ServletRequest req, ServletResponse resp)
    {
        m_logger.info("opening user");
        String email = req.getParameter("em");
        String verify = req.getParameter("vfy");
        removeCookie((HttpServletResponse) resp);
        UserHelper userHelper = new UserHelper(email, null);
        if (! userHelper.isKnownUser()) {
            req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e103");
        }
        else {
            CookieHelper.addCookie((HttpServletResponse) resp, userHelper);
            if ((verify != null) && verify.equals("y")) {
                sendVerificationEmail(userHelper.get(UserHelper.ID), userHelper.get(UserHelper.EMAIL), req);
            }
            m_logger.info("user " + email + " exists with id " + userHelper.get(UserHelper.ID));
        }
    }
    
    /**
     * Creates a DB entry for a new user and loads their info into a session cookie.
     * The email is checked for basic syntax, and the trove key is validated by a Trove API call
     * before the DB record is created.
     * @param req
     * @param resp
     */
    private void addUser (ServletRequest req, ServletResponse resp)
    {
        m_logger.info("adding user");
        String email = req.getParameter("em");
        String troveKey = req.getParameter("tk");
        String verify = req.getParameter("vfy");
        m_logger.info("AddUserFilter email:"+email+" key:"+troveKey+" verify="+verify);
        
        UserHelper userHelper = new UserHelper(email, troveKey);
        try {
            if (userHelper.isKnownUser()) {
                m_logger.info("user " + email + " exists with id " + userHelper.get(UserHelper.ID));
                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e100");
            }
            else {
                m_logger.info("Adding " + email + " (" + troveKey + ")");
                if (! isValidEmailAddress(email)) {    
                    req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e101");
                }
                else if (! isValidTroveKey(troveKey)) {
                    req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e102");
                }
                else {
                    userHelper.createUser(email, troveKey);
                    CookieHelper.addCookie((HttpServletResponse) resp, userHelper);
                    m_logger.debug("user ID=" + userHelper.get(UserHelper.ID) + " status=" + userHelper.get(UserHelper.STATUS));
                    
                    if ((verify != null) && verify.equals("y")) {
                        sendVerificationEmail(userHelper.get(UserHelper.ID), userHelper.get(UserHelper.EMAIL), req);
                    }
                    
                    m_logger.info("Added " + email + " (" + troveKey + ") OK");
                }
            }
        }
        catch (PaperMinerException ex) {
            m_logger.error("unexpected error", ex);
        }
    }

    /**
     * Validates Trove key by making a Trove API call.
     * @param troveKey
     * @return
     */
    private boolean isValidTroveKey(String troveKey) 
    {
        TroveHelper trove = new TroveHelper(troveKey);
        return trove.isValidKey();
    }
    
    /**
     * Return user prefs as JSON, checking that the user id in the cookie (if any) still exists.
     * @param req The request
     * @param resp The response
     */
    private void getPrefs (HttpServletRequest req, HttpServletResponse resp)
    {
        m_logger.debug("get user prefs ");
        try {
        	String id = CookieHelper.getCookieValue(req, PaperMinerConstants.PMC_USER_ID);
            UserHelper helper = new UserHelper(id);
        	if (! helper.isKnownUser()) {
        		removeCookie(resp);
                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e103");        		
        	}
        	else {
        		HashMap<String, String> map = new HashMap<String, String>();
        		map.put("id", CookieHelper.getCookieValue(req, PaperMinerConstants.PMC_USER_ID));
        		map.put("key", CookieHelper.getCookieValue(req, PaperMinerConstants.PMC_TROVE_KEY));
        		map.put("em",  CookieHelper.getCookieValue(req, PaperMinerConstants.PMC_USER_STATUS));
        		map.put("stat",  CookieHelper.getCookieValue(req, PaperMinerConstants.PMC_USER_STATUS));
        		String jsonStr = JSONValue.toJSONString(map);
		        resp.setContentType("text/json");
		        PrintWriter pm = resp.getWriter();
		        pm.write(jsonStr);
        	}
        }
        catch (IOException ex) {
            req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e110");
        }
    }
    
    /**
     * Effectively logs out the user
     * @param resp
     */
    private void removeCookie (HttpServletResponse resp)
    {
        Cookie cookie = new Cookie(PaperMinerConstants.PM_COOKIE, "");
        cookie.setMaxAge(0);
        resp.addCookie(cookie);
    }
    
    /**
     * Changes the status of a user
     * @param newStatus Status value to set
     * @param req
     * @param resp
     */
    private void setStatus  (int newStatus, ServletRequest req, ServletResponse resp)
    {
        m_logger.debug("set status");
        String id = req.getParameter("id");
        UserHelper helper = new UserHelper(id);
        if (helper.isKnownUser()) {
            m_logger.info("Upgrading status for user " + id);
            helper.set(UserHelper.STATUS, Integer.toString(newStatus));
            try {
                helper.update();
            }
            catch (PaperMinerException ex) {
                m_logger.error("Status update failed", ex);
                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e105");
            }
            req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e111");
        }
    }
    
    /**
     * Sends an email to the user asking they follow a link to validate their email address
     * @param id DB key to be embedded in response link
     * @param email Address target
     */
    private void sendVerificationEmail (String id, String email, ServletRequest req)
    {
        m_logger.debug("sending mail");
        String from = "admin@" + m_serverName;
        Properties props = new Properties();
        props.put("mail.smpt.host", m_serverName);
        props.put("mail.from", from);
        Session session = Session.getInstance(props, null);
        try {
            MimeMessage msg = new MimeMessage(session);
            msg.setRecipients(Message.RecipientType.TO, email);
            msg.setSubject("Verify your PaperMiner email address");
            msg.setSentDate(new Date());
            // FIXME: the verify address needs to be more robust
            msg.setText("Dear " + email.substring(0, email.indexOf("@")) + ",\n\n" +
                "PaperMiner has sent you this message to validate that the email address which you " +
                "supplied is able to receive notifications from our server.\n" +
                "To complete the verification process, please click the link below.\n\n" +
                "http://" + m_serverName + ":8080/PaperMiner/pm/vfy?id=" + id + "\n\n" +
                "If you are unable to click the link above, verification can be completed by copying " +
                "and pasting it into the address bar of your web browser.\n\n" +
                "Your email address is " + email + ". Use this to log in when returning to the PaperMiner site.\n" +
                "You can update your email address, or change your TROVE API key at any time through the " +
                "\"Manage Your Details\" option of the User menu, but an email change will require re-validation.\n\n" +
                "Paper Miner Administrator"
            );
            Transport.send(msg);
            m_logger.info("Verifcation mail sent to " + email);
        }
        catch (MessagingException ex) {
            m_logger.error("Email verification to " + email + " failed", ex);
            req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e109");
        }        
    }

    /**
     * Either extracts the current user editable data (email and trove key) for possible
     * user modification, or resets the DB data to passed values.
     * @param req
     * @param resp
     */
    private void updateUser (HttpServletRequest req, HttpServletResponse resp) 
    {
        String id = req.getParameter("id");
        m_logger.info("updating user info "+id);
        if ((id != null) && id.length() > 0) {
            resetUserData(id, req, resp);
        }
        else {
        	id = CookieHelper.getCookieValue(req, PaperMinerConstants.PMC_USER_ID);
        	if (id == null) {
                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e110");
        	}
        	else {
                m_logger.debug("retrieving user info");
                UserHelper helper = new UserHelper(id);
                if (! helper.isKnownUser()) {
                    req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e106");
                }
                else {
                    try {
                        resp.setContentType("text/html");
                        PrintWriter pm = resp.getWriter();
                        pm.write("<form id=\"user-mod\" action=\"\" method=\"post\">");
                        pm.append("<input id=\"id\" type=\"hidden\" value=\"" + helper.get(UserHelper.ID) + "\"/>");
                        pm.append("<table>");
                        pm.append("<tr><td>eMail address </td><td><input id=\"em\" type=\"text=\" value=\"" + helper.get(UserHelper.EMAIL) + "\"/></td></tr>");
                        pm.append("<tr><td>TROVE Key </td><td><input id=\"tk\" type=\"text=\" value=\"" + helper.get(UserHelper.TROVE_KEY) + "\"/></td></tr>");
                        pm.append("</table>");
                        pm.append("<p><input id=\"vfy\" name=\"usr-cb\" type=\"checkbox\" value=\"verify\"/> Verify my eMail Address.");
                        pm.append("</form>");
                    }
                    catch (IOException ex) {
                        req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e107");
                    }
                }
            }
        }
    }
    
    /**
     * Set values and update persistent user store. If the email has changed, reset status
     * and issue verification email if requested.
     * @param id User ID
     * @param req
     * @param resp
     */
    private void resetUserData (String id, ServletRequest req, ServletResponse resp)
    {
        UserHelper helper = new UserHelper(id);

        if (helper.isKnownUser()) {
            String email = req.getParameter("em");
            String troveKey = req.getParameter("tk");
            String verify = req.getParameter("vfy");
            m_logger.debug(email+","+troveKey+","+verify);
            if (! isValidEmailAddress(email)) {    
                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e101");
            }
            else if (! isValidTroveKey(troveKey)) {
                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e102");
            }
            else {
                boolean emailChanged = ! email.equals(helper.get(UserHelper.EMAIL));
                if (email.equals(helper.get(UserHelper.EMAIL)) && troveKey.equals(helper.get(UserHelper.TROVE_KEY))) {
                    m_logger.debug("update ignored, no change: "+email+","+troveKey+","+verify);
                }
                else {
                    String status = emailChanged ? Integer.toString(PaperMinerConstants.USER_CREATED) : helper.get(UserHelper.STATUS);
                    helper.set(UserHelper.EMAIL, email);
                    helper.set(UserHelper.STATUS, status);
                    helper.set(UserHelper.TROVE_KEY, troveKey);
                    m_logger.debug("Updating user " + id + " to " + email + "/" + troveKey + " status " + status);
                    try {
                        helper.update();
                    }
                    catch (PaperMinerException ex) {
                        m_logger.error("error updating user", ex);
                        req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e108");
                    }
                }
                //if ((emailChanged || helper.get(UserHelper.STATUS).equals(PaperMinerConstants.USER_CREATED)) && (verify != null) && verify.equals('y')) {
                if ((verify != null) && verify.equals("y")) {
                    sendVerificationEmail(id, email, req);
                }
            }
        }
    }
    
    /**
     * Saves a PM TROVE query for later reuse.
     * @param req
     * @param resp
     */
    private void saveQuery (HttpServletRequest req, HttpServletResponse resp) 
    {
        UserHelper helper = getUserHelper(req);
    	if (helper == null) {
            req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e104");
    	}
    	else {
        	try {
	            String descr = req.getParameter("d");
	            String query = req.getParameter("q");
	            String qType = req.getParameter("t");
	            String check = req.getParameter("c");
	            String total = req.getParameter("n");
	            if (check != null) {
	            	m_logger.debug("Checking quota for " + helper.get(UserHelper.ID) );
	            	if (! helper.canSaveQuery()) {
	                    req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e113");
	            	}
	            	else if (helper.savedQueryExists(descr, query, qType)) {
	                    req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e112");
	            	}
	            }
	            else {
	            	m_logger.debug("Saving descr='" + descr + "' query='" + query + "' type='" + qType + " total=" + total + "' for user " + helper.get(UserHelper.ID));
	            	int tot = Integer.parseInt(total);
	            	if (! helper.saveQuery(descr, query, qType, tot)) {
	                    req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e114");
	            	}
	            }
        	}
        	catch (PaperMinerException ex) {
                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e114");
        	}
    	}
	}
    
    /**
     * Returns requesting user's stored query data as JSON array of associative arrays using DB table columns as keys.
     * @param req
     * @param resp
     */
    private void getQueryData (HttpServletRequest req, HttpServletResponse resp) 
    {
        UserHelper helper = getUserHelper(req);
        if (helper == null) {
            req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e104");
        }
        else {
        	try {
        		m_logger.debug("Fetching queries for " + CookieHelper.getCookieValue(req, PaperMinerConstants.PMC_USER_ID));
        		ArrayList<HashMap <String, String>> list = helper.getSavedQueries();
        		m_logger.debug("Fetchied " + list.size());
        		m_logger.debug("stored query count = " + list.size());
        		String jsonStr = JSONValue.toJSONString(list);
        		m_logger.debug("query string = " + jsonStr);
	            resp.setContentType("text/json");
	            PrintWriter pm = resp.getWriter();
	            pm.write(jsonStr);
	            pm.close();
        	}
        	catch (IOException ex) {
                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e114");
        	}
        	catch (PaperMinerException ex) {
                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e114");
        	}
        }
    }
    
    /**
     * Deletes one or more stored queries for the requesting user
     * @param req
     * @param resp
     */
    private void deleteQuery (HttpServletRequest req, HttpServletResponse resp) 
    {
        String ids = req.getParameter("ids");
        UserHelper helper = getUserHelper(req);
        if (helper == null) {
            req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e104");
        }
        else if (ids != null) {
        	try {
	       	    int count = ids.split(",").length;
	       	    int res = helper.deleteStoredQueries(ids);
	       	    if (res != count) {
	                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e115");
	       	    }
        	}
        	catch (PaperMinerException ex) {
                req.setAttribute(PaperMinerConstants.ERROR_PAGE, "e114");
        	}
        }
    }
    
    /**
     * Reasonable check that a string might be a valid email address
     * @param email String perhaps conforming to the RFC for email addresses
     * @return True if conforms to RFC 822
     */
    private boolean isValidEmailAddress (String email)
    {
    	String regex = "^[-!#$%&'*+/0-9=?^_a-z{|}~]([+\\.]?[-!#$%&'*/0-9=?^_a-z{|}~])*@[a-z](-?[a-z0-9])*(\\.[a-z](-?[a-z0-9])*)+$";
        return Pattern.matches(regex, email.toLowerCase());
    }
    
    /**
     * Convenience method obtains a Helper for the requesting user
     * @param req The user request
     * @return A helper or null if no user found
     */
    private UserHelper getUserHelper (HttpServletRequest req)
    {
    	String id = CookieHelper.getCookieValue(req, PaperMinerConstants.PMC_USER_ID);
        return (id == null) ? null : new UserHelper(id);
    }

}

// EOF

