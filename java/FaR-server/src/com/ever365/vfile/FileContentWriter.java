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
package com.ever365.vfile;

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.channels.Channels;
import java.nio.channels.WritableByteChannel;

import net.gqu.utils.FileCopyUtils;


/**
 * Provides direct access to a local file.
 * <p>
 * This class does not provide remote access to the file.
 * 
 * @author Derek Hulley
 */
public class FileContentWriter {

	private File file;
	private File root;
	
	/**
	 * Constructor that builds a URL based on the absolute path of the file.
	 * 
	 * @param file
	 *            the file for writing. This will most likely be directly
	 *            related to the content URL.
	 */
	public FileContentWriter(File root, File file) {
		this.file = file;
		this.root = root;
	}


	/**
	 * @return Returns the file that this writer accesses
	 */
	public File getFile() {
		return file;
	}

	/**
	 * @return Returns the size of the underlying file or
	 */
	public long getSize() {
		if (file == null)
			return 0L;
		else if (!file.exists())
			return 0L;
		else
			return file.length();
	}

	/**
	 * @see Channels#newOutputStream(java.nio.channels.WritableByteChannel)
	 */
	public OutputStream getContentOutputStream() {
		try {
			WritableByteChannel channel = getWritableChannel();
			OutputStream is = new BufferedOutputStream(Channels.newOutputStream(channel));
			// done
			return is;
		} catch (Throwable e) {
			return null;
		}
	}

	public WritableByteChannel getWritableChannel() {
		try {
			// we may not write to an existing file - EVER!!
			if (file.exists() && file.length() > 0) {
				throw new IOException("File exists - overwriting not allowed");
			}
			// create the channel
			WritableByteChannel channel = null;
			
			OutputStream os = new FileOutputStream(file);
			channel = Channels.newChannel(os);
			return channel;
		} catch (Throwable e) {
			return null;
		}
	}

	public void putContent(InputStream is) {
		try
        {
            OutputStream os = getContentOutputStream();
            FileCopyUtils.copy(is, os);     // both streams are closed
            // done
        }
        catch (IOException e)
        {
            throw new ContentException("Failed to copy content from input stream: \n" +
                    "   writer: " + this,
                    e);
        }

	}

	public void putContent(File file) {
		 try
	        {
	            OutputStream os = getContentOutputStream();
	            FileInputStream is = new FileInputStream(file);
	            FileCopyUtils.copy(is, os);     // both streams are closed
	            // done
	        }
	        catch (IOException e)
	        {
	            throw new ContentException("Failed to copy content from file: \n" +
	                    "   writer: " + this + "\n" +
	                    "   file: " + file,
	                    e);
	        }

	}

	public void putContent(String content, String encoding) {
	    try
        {
            // attempt to use the correct encoding
            byte[] bytes = (encoding == null) ? content.getBytes() : content.getBytes(encoding);
            // get the stream
            OutputStream os = getContentOutputStream();
            ByteArrayInputStream is = new ByteArrayInputStream(bytes);
            FileCopyUtils.copy(is, os);     // both streams are closed
            // done
        }
        catch (IOException e)
        {
            throw new ContentException("Failed to copy content from string: \n" +
                    "   writer: " + this +
                    "   content length: " + content.length(),
                    e);
        }
	}

	public String getUri() {
		if (file.getAbsolutePath().startsWith(root.getAbsolutePath())) {
			return file.getAbsolutePath().substring(root.getAbsolutePath().length());
		} else {
			throw new ContentException("file is not under root", null);
		}
	}
	
 
}
