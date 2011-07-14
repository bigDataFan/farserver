/*
 * Copyright (C) 2006-2010 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

package com.ever365.vfile.protocol.ftp;

/**
 * FTP Path Class
 * 
 * <p>Converts FTP paths to share/share relative paths.
 *
 * @author gkspencer
 */
public class FTPPath {

	//	FTP directory seperator

	private static final String FTP_SEPERATOR  		= "/";
	private static final char FTP_SEPERATOR_CHAR	=	'/';
	
	//	Share relative path directory seperator
	
	//private static final String DIR_SEPERATOR 		= "\\";
	//private static final char DIR_SEPERATOR_CHAR	= '\\';

	//	FTP path
	
	private String m_ftpPath;
	
	//	Share name nad share relative path
	
	private String m_shareName;
	private String m_sharePath;
	
	//	Flag to indicate if this is a directory or file path
	
	private boolean m_dir = true;
	
	/**
	 * Default constructor
	 */
	public FTPPath() {
		try {
			setFTPPath(null);
		}
		catch (Exception ex) {
		}
	}
	
	/**
	 * Class constructor
	 * 
	 * @param ftpPath String
	 * @exception InvalidPathException
	 */
	public FTPPath(String ftpPath)
		throws InvalidPathException {
		setFTPPath(ftpPath);
	}
	

	/**
	 * Copy constructor
	 * 
	 * @param ftpPath FTPPath
	 */
	public FTPPath(FTPPath ftpPath) {
		try {
			setFTPPath(ftpPath.getFTPPath());
		}
		catch (Exception ex) {
		}
	}
	
	/**
	 * Determine if the current FTP path is the root path
	 * 
	 * @return boolean
	 */
	public final boolean isRootPath() {
		return m_ftpPath.compareTo(FTP_SEPERATOR) == 0 ? true : false;
	}
	
	/**
	 * Determine if the path is for a directory or file
	 * 
	 * @return boolean
	 */
	public final boolean isDirectory() {
		return m_dir;
	}
	
	/**
	 * Check if the FTP path is valid
	 * 
	 * @return boolean
	 */
	public final boolean hasFTPPath() {
		return m_ftpPath != null ? true : false;
	}
		
	/**
	 * Return the FTP path
	 * 
	 * @return String
	 */
	public final String getFTPPath() {
		return m_ftpPath;
	}

	/**
	 * Check if the share name is valid
	 * 
	 * @return boolean
	 */
	public final boolean hasShareName() {
		return m_shareName != null ? true : false;
	}
		
	/**
	 * Return the share name
	 * 
	 * @return String
	 */
	public final String getShareName() {
		return m_shareName;
	}

	public boolean isEditableFile() {
		return (m_shareName !=null) && (m_sharePath!=null) && !m_sharePath.equals(FTP_SEPERATOR);
	}
	
	/**
	 * Check if the share path is valid
	 * 
	 * @return boolean
	 */
	public final boolean hasSharePath() {
		return m_sharePath != null ? true : false;
	}
	
	/**
	 * Return the share relative path
	 * 
	 * @return String
	 */
	public final String getSharePath() {
		return m_sharePath;
	}

		
	/**
	 * Set the paths using the specified FTP path
	 * 
	 * @param path String
	 * @exception InvalidPathException
	 */
	public final void setFTPPath(String path)
		throws InvalidPathException {

		//	Check for a null path or the root path
		
		if ( path == null || path.length() == 0 || path.compareTo(FTP_SEPERATOR) == 0) {
			m_ftpPath = FTP_SEPERATOR;
			m_shareName = null;
			m_sharePath = null;
			return;
		}
		
		//	Check if the path starts with the FTP seperator
		
		if ( path.startsWith(FTP_SEPERATOR) == false)
			throw new InvalidPathException("Invalid FTP path, should start with " + FTP_SEPERATOR);
		
		//	Save the FTP path
		
		m_ftpPath = path;
			
		//	Get the first level directory from the path, this maps to the share name
		
		int pos = path.indexOf(FTP_SEPERATOR, 1);
		if ( pos != -1) {
			m_shareName = path.substring(1,pos);
			if ( path.length() > pos)
				m_sharePath = path.substring(pos);
			else
				m_sharePath = FTP_SEPERATOR;
		}
		else {
			m_shareName = path.substring(1);
			m_sharePath = FTP_SEPERATOR;
		}
	}
	
	/**
	 * Build an FTP path to the specified file
	 * 
	 * @param fname String
	 * @return String
	 */
	public final String makeFTPPathToFile(String fname) {
		
		//	Build the FTP path to a file
		
		StringBuffer path = new StringBuffer(256);
		path.append(m_ftpPath);
		if ( m_ftpPath.endsWith(FTP_SEPERATOR) == false)
			path.append(FTP_SEPERATOR);
		path.append(fname);
		
		return path.toString();
	}
	
	
	/**
	 * Add a directory to the end of the current path
	 * 
	 * @param dir String
	 */
	public final void addDirectory(String dir) {

		//	Check if the directory has a trailing seperator
		
		if ( dir.length() > 1 && dir.endsWith(FTP_SEPERATOR))
			dir = dir.substring(0, dir.length() - 1);
		
		//	Append the directory to the FTP path

		StringBuffer str = new StringBuffer(256);
		str.append(m_ftpPath);
				
		if ( m_ftpPath.endsWith(FTP_SEPERATOR) == false)
			str.append(FTP_SEPERATOR);
		str.append(dir);
		if ( m_ftpPath.endsWith(FTP_SEPERATOR) == false)
			str.append(FTP_SEPERATOR);
		
		m_ftpPath = str.toString();
		
		//	Append the directory to the share relative path
		
		str.setLength(0);
		str.append(m_sharePath);
		if ( m_sharePath.endsWith(FTP_SEPERATOR) == false)
			str.append(FTP_SEPERATOR);
		str.append(dir);
		
		m_sharePath = str.toString();
		//	Indicate that the path is to a directory
		setDirectory(true);
	}
	
	/**
	 * Add a file to the end of the current path
	 * 
	 * @param file String
	 */
	public final void addFile(String file) {
		
		//	Append the file name to the FTP path

		StringBuffer str = new StringBuffer(256);
		str.append(m_ftpPath);
				
		if ( m_ftpPath.endsWith(FTP_SEPERATOR) == false)
			str.append(FTP_SEPERATOR);
		str.append(file);
		
		m_ftpPath = str.toString();

		//	Append the file name to the share relative path
		
		str.setLength(0);
		str.append(m_sharePath);
		if ( m_sharePath.endsWith(FTP_SEPERATOR) == false)
			str.append(FTP_SEPERATOR);
		str.append(file);
		
		m_sharePath = str.toString();

		//	Indicate that the path is to a file
		setDirectory(false);
	}
	
	/**
	 * Remove the last directory from the end of the path
	 */
	public final void removeDirectory() {
		
		//	Check if the FTP path has a directory to remove
		
		if ( m_ftpPath != null && m_ftpPath.length() > 1) {
			
			//	Find the last directory in the FTP path
			
			int pos = m_ftpPath.length() - 1;
			if ( m_ftpPath.endsWith(FTP_SEPERATOR))
				pos--;
				
			while ( pos > 0 && m_ftpPath.charAt(pos) != FTP_SEPERATOR_CHAR)
				pos--;

			//	Set the new FTP path
							
			m_ftpPath = m_ftpPath.substring(0,pos);
			
			//	Indicate that the path is to a directory
			
			setDirectory(true);
			
			//	Reset the share/share path

			try {			
				setFTPPath(m_ftpPath);
			}
			catch (InvalidPathException ex) {
			}
		}
	}
	
	/**
	 * Set/clear the directory path flag
	 * 
	 * @param dir boolean
	 */
	protected final void setDirectory(boolean dir) {
		m_dir = dir;
	}
	
	/**
	 * Check if an FTP path string contains multiple directories
	 * 
	 * @param path String
	 * @return boolean
	 */
	public final static boolean hasMultipleDirectories(String path) {
		if ( path == null)
			return false;
			
		if ( path.startsWith(FTP_SEPERATOR))
			return true;
		return false;
	}

	/**
	 * Check if the FTP path is a relative path, ie. does not start with a leading slash
	 * 
	 * @param path String
	 * @return boolean
	 */
	public final static boolean isRelativePath(String path) {
		if ( path == null)
			return false;
		return path.startsWith(FTP_SEPERATOR) ? false : true;
	}
	
	/**
	 * Return the FTP path as a string
	 * 
	 * @return String
	 */
	public String toString() {
		StringBuffer str = new StringBuffer();
		
		str.append("[");
		str.append(getFTPPath());
		str.append("=");
		str.append(getShareName());
		str.append(",");
		str.append(getSharePath());
		str.append("]");
		
		return str.toString();
	}
}
