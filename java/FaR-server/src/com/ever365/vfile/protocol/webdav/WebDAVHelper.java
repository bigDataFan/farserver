/*
 * Copyright (C) 2005-2007 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing"
 */
package com.ever365.vfile.protocol.webdav;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.xml.sax.helpers.AttributesImpl;

/**
 * WebDAV Protocol Helper Class
 * 
 * <p>Provides helper methods for repository access using the WebDAV protocol.
 * 
 * @author GKSpencer
 */
public class WebDAVHelper
{
    // Constants
    
    // Path seperator
    public static final String PathSeperator   = "/";
    public static final char PathSeperatorChar = '/';
    
    // Logging
    private static Log logger = LogFactory.getLog("org.alfresco.protocol.webdav");
    
    //  Empty XML attribute list
    
    private static AttributesImpl m_nullAttribs = new AttributesImpl();
    /**
     * Encodes the given string to valid URL format
     * 
     * @param s             the String to convert
     */
    public final static String encodeURL(String s)
    {
        try
        {
            return replace(URLEncoder.encode(s, "UTF-8"), "+", "%20");
        }
        catch (UnsupportedEncodingException err)
        {
            throw new RuntimeException(err);
        }
    }
    
    /**
     * Replace one string instance with another within the specified string
     * 
     * @return              Returns the replaced string
     */
    public static String replace(String str, String repl, String with)
    {
        int lastindex = 0;
        int pos = str.indexOf(repl);
        
        // If no replacement needed, return the original string
        // and save StringBuffer allocation/char copying
        if (pos < 0)
        {
            return str;
        }
        
        int len = repl.length();
        int lendiff = with.length() - repl.length();
        StringBuilder out = new StringBuilder((lendiff <= 0) ? str.length() : (str.length() + (lendiff << 3)));
        for (; pos >= 0; pos = str.indexOf(repl, lastindex = pos + len))
        {
            out.append(str.substring(lastindex, pos)).append(with);
        }
        
        return out.append(str.substring(lastindex, str.length())).toString();
    }
    
    /**
     * Encodes the given string to valid HTML format
     * 
     * @param string        the String to convert
     */
    public final static String encodeHTML(String string)
    {
        if (string == null)
        {
            return "";
        }
        
        StringBuilder sb = null;      //create on demand
        String enc;
        char c;
        for (int i = 0; i < string.length(); i++)
        {
            enc = null;
            c = string.charAt(i);
            switch (c)
            {
                case '"': enc = "&quot;"; break;    //"
                case '&': enc = "&amp;"; break;     //&
                case '<': enc = "&lt;"; break;      //<
                case '>': enc = "&gt;"; break;      //>
                
                //german umlauts
                case '\u00E4' : enc = "&auml;";  break;
                case '\u00C4' : enc = "&Auml;";  break;
                case '\u00F6' : enc = "&ouml;";  break;
                case '\u00D6' : enc = "&Ouml;";  break;
                case '\u00FC' : enc = "&uuml;";  break;
                case '\u00DC' : enc = "&Uuml;";  break;
                case '\u00DF' : enc = "&szlig;"; break;
                
                //misc
                //case 0x80: enc = "&euro;"; break;  sometimes euro symbol is ascii 128, should we suport it?
                case '\u20AC': enc = "&euro;";  break;
                case '\u00AB': enc = "&laquo;"; break;
                case '\u00BB': enc = "&raquo;"; break;
                case '\u00A0': enc = "&nbsp;"; break;
                
                default:
                    if (((int)c) >= 0x80)
                    {
                        //encode all non basic latin characters
                        enc = "&#" + ((int)c) + ";";
                    }
                break;
            }
            
            if (enc != null)
            {
                if (sb == null)
                {
                    String soFar = string.substring(0, i);
                    sb = new StringBuilder(i + 8);
                    sb.append(soFar);
                }
                sb.append(enc);
            }
            else
            {
                if (sb != null)
                {
                    sb.append(c);
                }
            }
        }
        
        if (sb == null)
        {
            return string;
        }
        else
        {
            return sb.toString();
        }
    }
    
    /**
     * Split the path into seperate directory path and file name strings.
     * If the path is not empty, then there will always be an entry for the filename
     * 
     * @param path Full path string.
     * @return Returns a String[2] with the folder path and file path.
     */
    public static final String[] splitPath(String path)
    {
        if (path == null)
            throw new IllegalArgumentException("path may not be null");
        
        // Create an array of strings to hold the path and file name strings
        String[] pathStr = new String[] {"", ""};

        // Check if the path has a trailing seperator, if so then there is no file name.

        int pos = path.lastIndexOf(PathSeperatorChar);
        if (pos == -1 || pos == (path.length() - 1))
        {
            // Set the path string in the returned string array
            pathStr[1] = path;
        }
        else
        {
            pathStr[0] = path.substring(0, pos);
            pathStr[1] = path.substring(pos + 1);
        }
        // Return the path strings
        return pathStr;
    }
}
