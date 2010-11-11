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
package net.gqu.webscript;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.IdScriptableObject;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Undefined;
import org.mozilla.javascript.Wrapper;


/**
 * Value conversion allowing safe usage of values in Script and Java.
 */
public class ValueConverter
{
    private static final String TYPE_DATE = "Date";
    
    
   
    
    /**
     * Convert an object from any script wrapper value to a valid repository serializable value.
     * This includes converting JavaScript Array objects to Lists of valid objects.
     * 
     * @param value     Value to convert from script wrapper object to repo serializable value
     * 
     * @return valid repo value
     */
    public static Serializable convertValueForRepo(Serializable value)
    {
        if (value == null || value instanceof Undefined)
        {
            return null;
        }
        else if (value instanceof Wrapper)
        {
            // unwrap a Java object from a JavaScript wrapper
            // recursively call this method to convert the unwrapped value
            value = convertValueForRepo((Serializable)((Wrapper)value).unwrap());
        }
        else if (value instanceof Scriptable)
        {
            // a scriptable object will probably indicate a multi-value property
            // set using a JavaScript Array object
            Scriptable values = (Scriptable)value;
            
            if (value instanceof IdScriptableObject)
            {
                // TODO: add code here to use the dictionary and convert to correct value type
                if (TYPE_DATE.equals(((IdScriptableObject)value).getClassName()))
                {
                    Object javaObj = Context.jsToJava(value, Date.class);
                    if (javaObj instanceof Serializable)
                    {
                        value = (Serializable)javaObj;
                    }
                }
                else if (value instanceof NativeArray)
                {
                    // convert JavaScript array of values to a List of Serializable objects
                    Object[] propIds = values.getIds();
                    if (isArray(propIds) == true)
                    {                    
                        List<Serializable> propValues = new ArrayList<Serializable>(propIds.length);
                        for (int i=0; i<propIds.length; i++)
                        {
                            // work on each key in turn
                            Object propId = propIds[i];
                            
                            // we are only interested in keys that indicate a list of values
                            if (propId instanceof Integer)
                            {
                                // get the value out for the specified key
                                Serializable val = (Serializable)values.get((Integer)propId, values);
                                // recursively call this method to convert the value
                                propValues.add(convertValueForRepo(val));
                            }
                        }

                        value = (Serializable)propValues;
                    }
                    else
                    {
                        Map<Serializable, Serializable> propValues = new HashMap<Serializable, Serializable>(propIds.length);
                        for (Object propId : propIds)
                        {
                            // Get the value and add to the map
                            Serializable val = (Serializable)values.get(propId.toString(), values);
                            propValues.put(convertValueForRepo((Serializable)propId), convertValueForRepo(val));
                        }
                        
                        value = (Serializable)propValues;
                    }
                }
                else
                {
                    // convert Scriptable object of values to a Map of Serializable objects
                    Object[] propIds = values.getIds();
                    Map<String, Serializable> propValues = new HashMap<String, Serializable>(propIds.length);
                    for (int i=0; i<propIds.length; i++)
                    {
                        // work on each key in turn
                        Object propId = propIds[i];

                        // we are only interested in keys that indicate a list of values
                        if (propId instanceof String)
                        {
                            // get the value out for the specified key
                            Serializable val = (Serializable)values.get((String)propId, values);
                            // recursively call this method to convert the value
                            propValues.put((String)propId, convertValueForRepo(val));
                        }
                    }
                    value = (Serializable)propValues;
                }
            }
            else
            {
                // convert Scriptable object of values to a Map of Serializable objects
                Object[] propIds = values.getIds();
                Map<String, Serializable> propValues = new HashMap<String, Serializable>(propIds.length);
                for (int i=0; i<propIds.length; i++)
                {
                    // work on each key in turn
                    Object propId = propIds[i];

                    // we are only interested in keys that indicate a list of values
                    if (propId instanceof String)
                    {
                        // get the value out for the specified key
                        Serializable val = (Serializable)values.get((String)propId, values);
                        // recursively call this method to convert the value
                        propValues.put((String)propId, convertValueForRepo(val));
                    }
                }
                value = (Serializable)propValues;
            }
        }
        else if (value instanceof Serializable[])
        {
            // convert back a list of Java values
            Serializable[] array = (Serializable[])value;
            ArrayList<Serializable> list = new ArrayList<Serializable>(array.length);
            for (int i=0; i<array.length; i++)
            {
                list.add(convertValueForRepo(array[i]));
            }
            value = list;
        }
        return value;
    }
    
    /**
     * Look at the id's of a native array and try to determine whether it's actually an Array or a Hashmap
     * 
     * @param ids       id's of the native array
     * @return boolean  true if it's an array, false otherwise (ie it's a map)
     */
    private static boolean isArray(Object[] ids)
    {
        boolean result = true;
        for (Object id : ids)
        {
            if (id instanceof Integer == false)
            {
               result = false;
               break;
            }
        }
        return result;
    }
    
}
