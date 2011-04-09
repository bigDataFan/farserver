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
package com.wikipy.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

/**
 * A wrapper class to serve up GUIDs
 *
 * @author kevinr
 */
public final class GUID
{
   /**
    * Private Constructor for GUID.
    */
   private GUID()
   {
   }

//   protected static final char[] s_values = 
//                                            {
//                                               '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e',
//                                               'f'
//                                            };
   
   public static Map<String, Object> getSystemInfo() {
	   Map<String, Object> result = new HashMap<String, Object>();
	   Properties prop =System.getProperties();
	   result.put("mem", String.valueOf(Runtime.getRuntime().totalMemory()));
	   result.put("os.name", prop.getProperty("os.name"));
	   result.put("os.arch",  prop.getProperty("os.arch"));
	   result.put("cores",  Runtime.getRuntime().availableProcessors());
	   return result;
   }
   
   /**
    * Generates and returns a new GUID as a string
    *
    * @return String GUID
    */
   public static String generate()
   {
//      return UUIDGenerator.getInstance().generateTimeBasedUUID().toString();
       // Request for random GUIDs: AR-2300
	   
       return UUID.randomUUID().toString();
   }
   
	
}
