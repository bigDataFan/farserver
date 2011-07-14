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
package com.gqu.vfile;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;

import net.gqu.utils.FileCopyUtils;



/**
 * Provides direct access to a local file.
 * <p>
 * This class does not provide remote access to the file.
 * 
 * @author Derek Hulley
 */
public class FileContentReader  {
	/**
	 * message key for missing content. Parameters are
	 * <ul>
	 * <li>{@link org.alfresco.service.cmr.repository.NodeRef NodeRef}</li>
	 * <li>{@link ContentReader ContentReader}</li>
	 * </ul>
	 */
	public static final String MSG_MISSING_CONTENT = "content.content_missing";


	private File file;
	private String encoding;
	private boolean allowRandomAccess;
	private ReadableByteChannel channel;

	/**
	 * Constructor that explicitely sets the URL that the reader represents.
	 * 
	 * @param file
	 *            the file for reading. This will most likely be directly
	 *            related to the content URL.
	 * @param url
	 *            the relative url that the reader represents
	 */
	public FileContentReader(File file, String encoding) {
		this.file = file;
		this.encoding = encoding;
		allowRandomAccess = true;
	}

	/* package */void setAllowRandomAccess(boolean allow) {
		this.allowRandomAccess = allow;
	}
	
	
	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}

	/**
	 * @return Returns the file that this reader accesses
	 */
	public File getFile() {
		return file;
	}

	public boolean exists() {
		return file.exists();
	}

	public String getUri() {
		return file.getAbsolutePath();
	}

	/**
	 * @see File#length()
	 */
	public long getSize() {
		if (!exists()) {
			return 0L;
		} else {
			return file.length();
		}
	}

	/**
	 * @see File#lastModified()
	 */
	public long getLastModified() {
		if (!exists()) {
			return 0L;
		} else {
			return file.lastModified();
		}
	}

	public ReadableByteChannel getDirectReadableChannel() {
		try {
			// the file must exist
			if (!file.exists()) {
				throw new IOException("File does not exist: " + file);
			}
			// create the channel
			ReadableByteChannel channel = null;
			if (allowRandomAccess) {
				RandomAccessFile randomAccessFile = new RandomAccessFile(file,
						"r"); // won't create it
				channel = randomAccessFile.getChannel();
			} else {
				InputStream is = new FileInputStream(file);
				channel = Channels.newChannel(is);
			}
			
			return channel;
		} catch (Throwable e) {
			throw new ContentException(
					"Failed to open file channel: " + this);
		}
	}

	/**
	 * @return Returns false as this is a reader
	 */
	public boolean canWrite() {
		return false; // we only allow reading
	}

	public InputStream getContentInputStream() {
		try {
			ReadableByteChannel channel = getReadableChannel();
			InputStream is = new BufferedInputStream(Channels
					.newInputStream(channel));
			return is;
		} catch (Throwable e) {
			throw new ContentException(
					"Failed to open stream onto channel: \n" + "   accessor: "
							+ this);
		}
	}

	public String getContentString() {
		try {
			// read from the stream into a byte[]
			InputStream is = getContentInputStream();
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			FileCopyUtils.copy(is, os); // both streams are closed
			byte[] bytes = os.toByteArray();
			// get the encoding for the string
			String encoding = getEncoding();
			// create the string from the byte[] using encoding if necessary
			String content = (encoding == null) ? new String(bytes)
					: new String(bytes, encoding);
			// done
			return content;
		} catch (IOException e) {
			throw new ContentException("Failed to copy content to string: \n"
					+ "   accessor: " + this, e);
		}
	}

	private String getEncoding() {
		if (encoding==null) {
			return "UTF-8";
		} else {
			return encoding;
		}
	}

	public String getContentString(int length) {
		if (length < 0 || length > Integer.MAX_VALUE) {
			throw new IllegalArgumentException(
					"Character count must be positive and within range");
		}
		Reader reader = null;
		try {
			// just create buffer of the required size
			char[] buffer = new char[length];

			String encoding = getEncoding();
			// create a reader from the input stream
			if (encoding == null) {
				reader = new InputStreamReader(getContentInputStream());
			} else {
				reader = new InputStreamReader(getContentInputStream(),
						encoding);
			}
			// read it all, if possible
			int count = reader.read(buffer, 0, length);

			// there may have been fewer characters - create a new string as the
			// result
			return (count != -1 ? new String(buffer, 0, count) : "");
		} catch (IOException e) {
			throw new ContentException("Failed to copy content to string: \n"
					+ "   accessor: " + this + "\n" + "   length: " + length, e);
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (Throwable e) {
					e.printStackTrace();
				}
			}
		}
	}

	public ReadableByteChannel getReadableChannel() {
		// this is a use-once object
		if (channel != null) {
			throw new RuntimeException("A channel has already been opened");
		}
		return getDirectReadableChannel();
	}

	public boolean isClosed() {
		if (channel != null) {
			return !channel.isOpen();
		} else {
			return false;
		}
	}

	public void readInto(OutputStream outputStream) {
	    try {
			InputStream inputStream = getContentInputStream();
			FileCopyUtils.copy(inputStream, outputStream); // both streams are
															// closed
			// done
		} catch (IOException e) {
			throw new ContentException(
					"Failed to copy content to output stream: \n"
							+ "   accessor: " + this, e);
		}
	}

	public File getLocalFile() {
		return file;
	}

	/**
     * Copies the {@link #getContentInputStream() input stream} to the given
     * <code>OutputStream</code>
     */
    public final void getContent(OutputStream os) throws ContentException
    {
        try
        {
            InputStream is = getContentInputStream();
            FileCopyUtils.copy(is, os);  // both streams are closed
            // done
        }
        catch (IOException e)
        {
            throw new ContentException("Failed to copy content to output stream: \n" +
                    "   accessor: " + this,
                    e);
        }
    }

	public Reader getReader(String charset) {
		InputStream is = getContentInputStream();
		
		try {
			return new InputStreamReader(is, charset);
		} catch (UnsupportedEncodingException e) {
			return null;
		}
	}

}
