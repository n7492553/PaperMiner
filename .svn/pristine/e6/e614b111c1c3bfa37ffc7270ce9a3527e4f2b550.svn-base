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

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import au.org.paperminer.db.UserHelper;

public class CookieHelper 
{
	/**
	 * This is not an instanciable class
	 */
	private CookieHelper () {}

    /**
     * Loads the user's Trove key, DB ID, email address, and status code into a cookie.
     * @param resp
     * @param helper User data container
     */
    public static final void addCookie (HttpServletResponse resp, UserHelper helper)
    {
        String cval = helper.get(UserHelper.TROVE_KEY) + "," + helper.get(UserHelper.ID) + "," + 
                      helper.get(UserHelper.EMAIL) + "," + helper.get(UserHelper.STATUS);
        Cookie cookie = new Cookie(PaperMinerConstants.PM_COOKIE, cval);
        cookie.setMaxAge(-1);
        resp.addCookie(cookie);
    }

    /**
     * Extracts our cookie string content
     * @param req The user request
     * @param param index into csv values in cookie 0..3
     * @return The string value or null
     */
    public static final String getCookieValue (HttpServletRequest req, int param)
    {
    	String value = null;
	    Cookie [] cookies = req.getCookies();
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            if (cookie.getName().equals(PaperMinerConstants.PM_COOKIE)) {
	                String [] values = cookie.getValue().split(",");
	                if (values.length >= 3) {
	                    value = values[param];
	                }
	            }
	        }
	    }
	    return value;
    }

}
