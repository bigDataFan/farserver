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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.StringTokenizer;
import java.util.TimeZone;
import java.util.Vector;

import net.gqu.utils.FileCopyUtils;
import net.gqu.utils.StringUtils;

import com.ever365.security.AuthenticationUtil;
import com.ever365.vfile.File;

/**
 * FTP Server Session Class
 * 
 * @author gkspencer
 */
public class FTPSrvSession extends SrvSession implements Runnable {

	// Constants
	//
	// Debug flag valueprs

	public static final int DBG_STATE 		= 0x00000001; // Session state changes
	public static final int DBG_RXDATA 		= 0x00000002; // Received data
	public static final int DBG_TXDATA 		= 0x00000004; // Transmit data
	public static final int DBG_DUMPDATA 	= 0x00000008; // Dump data packets
	public static final int DBG_SEARCH 		= 0x00000010; // File/directory search
	public static final int DBG_INFO 		= 0x00000020; // Information requests
	public static final int DBG_FILE 		= 0x00000040; // File open/close/info
	public static final int DBG_FILEIO 		= 0x00000080; // File read/write
	public static final int DBG_ERROR 		= 0x00000100; // Errors
	public static final int DBG_PKTTYPE 	= 0x00000200; // Received packet type
	public static final int DBG_TIMING 		= 0x00000400; // Time packet processing
	public static final int DBG_DATAPORT 	= 0x00000800; // Data port
	public static final int DBG_DIRECTORY 	= 0x00001000; // Directory commands

	// Enabled features

	public static final boolean FeatureUTF8 = true;
	public static final boolean FeatureMDTM = true;
	public static final boolean FeatureSIZE = true;
	public static final boolean FeatureMLST = true;

	// Root directory and FTP directory seperator

	private static final String ROOT_DIRECTORY 		= "/";
	private static final String FTP_SEPERATOR 		= "/";
	private static final char FTP_SEPERATOR_CHAR 	= '/';

	// Share relative path directory seperator

	private static final String DIR_SEPERATOR 		= "\\";
	private static final char DIR_SEPERATOR_CHAR 	= '\\';

	// File transfer buffer size

	private static final int DEFAULT_BUFFERSIZE = 64000;

	// Carriage return/line feed combination required for response messages

	protected final static String CRLF = "\r\n";

	// LIST command options

	protected final static String LIST_OPTION_PREFIX = "-";

	protected final static char LIST_OPTION_HIDDEN = 'a';

	// Machine listing fact ids

	protected static final int MLST_SIZE 		= 0x0001;
	protected static final int MLST_MODIFY 		= 0x0002;
	protected static final int MLST_CREATE 		= 0x0004;
	protected static final int MLST_TYPE 		= 0x0008;
	protected static final int MLST_UNIQUE		= 0x0010;
	protected static final int MLST_PERM 		= 0x0020;
	protected static final int MLST_MEDIATYPE 	= 0x0040;

	// Default fact list to use for machine listing commands

	protected static final int MLST_DEFAULT = MLST_SIZE + MLST_MODIFY + MLST_CREATE + MLST_TYPE + MLST_UNIQUE + MLST_PERM
			+ MLST_MEDIATYPE;

	// Machine listing fact names

	protected static final String _factNames[] = { "size", "modify", "create", "type", "unique", "perm", "media-type" };

	// MLSD buffer size to allocate

	protected static final int MLSD_BUFFER_SIZE = 4096;

	// Modify date/time minimum date/time argument length

	protected static final int MDTM_DATETIME_MINLEN = 14; // YYYYMMDDHHMMSS

	// Network address types, for EPRT and EPSV commands
	
	protected static final String TypeIPv4 = "1";
	protected static final String TypeIPv6 = "2";
	
	// Session socket

	private Socket m_sock;

	// Input/output streams to remote client

	private InputStream m_in;
	private byte[] m_inbuf;

	private OutputStreamWriter m_out;

	// List of pending FTP commands

	private List<FTPRequest> m_ftpCmdList;

	// Data connection

	private FTPDataSession m_dataSess;

	// Current working directory details
	//
	// First level is the share name then a path relative to the share root

	private FTPPath m_cwd;

	// Binary mode flag

	private boolean m_binary = false;

	// Restart position for binary file transfer

	private long m_restartPos = 0;

	// Flag to indicate if UTF-8 paths are enabled

	private boolean m_utf8Paths = true;
	private UTF8Normalizer m_normalizer;

	// Machine listing fact list

	private int m_mlstFacts = MLST_DEFAULT;

	// Rename from path details

	private FTPPath m_renameFrom;
	private BufferedReader m_reader;
	
	private File rootFile;
	
	
	
	
	public void setRootFile(File rootFile) {
		this.rootFile = rootFile;
	}

	/**
	 * Class constructor
	 * 
	 * @param sock Socket
	 * @param srv FTPServer
	 */
	public FTPSrvSession(Socket sock, FTPServer srv) {
		super(-1, srv, "FTP", null);

		// Save the local socket

		m_sock = sock;

		// Set the socket linger options, so the socket closes immediately when closed

		try {
			m_sock.setSoLinger(false, 0);
		}
		catch (SocketException ex) {
		}

		// Indicate that the user is not logged in

		setLoggedOn(false);

		// Allocate the FTP path

		m_cwd = new FTPPath();

		// Allocate the command list

		m_ftpCmdList = new ArrayList<FTPRequest>();

		// Get the UTF-8 string normalizer, if available

		m_normalizer = srv.getUTF8Normalizer();
	}

	/**
	 * Close the FTP session, and associated data socket if active
	 */
	public final void closeSession() {

		// Close the data connection, if active

		if ( m_dataSess != null) {
			getFTPServer().releaseDataSession(m_dataSess);
			m_dataSess = null;
		}
		
		// Close the socket first, if the client is still connected this should allow the
		// input/output streams to be closed

		if ( m_sock != null) {
			try {
				m_sock.close();
			}
			catch (Exception ex) {
			}
			m_sock = null;
		}

		// Close the input/output streams

		if ( m_in != null) {
			try {
				m_in.close();
			}
			catch (Exception ex) {
			}
			m_in = null;
		}

		if ( m_out != null) {
			try {
				m_out.close();
			}
			catch (Exception ex) {
			}
			m_out = null;
		}

		// Remove session from server session list

		getFTPServer().removeSession(this);
	}

	/**
	 * Return the current working directory
	 * 
	 * @return String
	 */
	public final String getCurrentWorkingDirectory() {
		return m_cwd.getFTPPath();
	}

	/**
	 * Return the server that this session is associated with.
	 * 
	 * @return FTPServer
	 */
	public final FTPServer getFTPServer() {
		return (FTPServer) getServer();
	}

	/**
	 * Return the client network address
	 * 
	 * @return InetAddress
	 */
	public final InetAddress getRemoteAddress() {
		return m_sock.getInetAddress();
	}

	/**
	 * Check if there is a current working directory
	 * 
	 * @return boolean
	 */
	public final boolean hasCurrentWorkingDirectory() {
		return m_cwd != null ? true : false;
	}

	/**
	 * Check if UTF-8 filenames are enabled
	 * 
	 * @return boolean
	 */
	public final boolean isUTF8Enabled() {
		return (m_utf8Paths == true && m_normalizer != null);
	}

	/**
	 * Set the default path for the session
	 * 
	 * @param rootPath FTPPath
	 */
	public final void setRootPath(FTPPath rootPath) {

		// Initialize the current working directory using the root path

		m_cwd = new FTPPath(rootPath);
	}

	/**
	 * Get the path details for the current request
	 * 
	 * @param req FTPRequest
	 * @param filePath boolean
	 * @return FTPPath
	 */
	protected final FTPPath generatePathForRequest(FTPRequest req, boolean filePath) {
		return generatePathForRequest(req, filePath, true);
	}

	/**
	 * Get the path details for the current request
	 * 
	 * @param req FTPRequest
	 * @param filePath boolean
	 * @param checkExists boolean
	 * @return FTPPath
	 */
	protected final FTPPath generatePathForRequest(FTPRequest req, boolean filePath, boolean checkExists) {

		// Convert the path from UTF-8, if enabled

		String path = req.getArgument();

		// Convert the path to an FTP format path

		path = convertToFTPSeperators(path);

		// Check if the path is the root directory and there is a default root path configured

		FTPPath ftpPath = null;

		if ( path.compareTo(ROOT_DIRECTORY) == 0) {

			// Check if the FTP server has a default root directory configured

			FTPServer ftpSrv = (FTPServer) getServer();
			if ( ftpSrv.hasRootPath())
				ftpPath = ftpSrv.getRootPath();
			else {
				try {
					ftpPath = new FTPPath("/");
				}
				catch (Exception ex) {
				}
				return ftpPath;
			}
		}

		// Check if the path is relative

		else if ( FTPPath.isRelativePath(path) == false) {

			// Create a new path for the directory

			try {
				ftpPath = new FTPPath(path);
			}
			catch (InvalidPathException ex) {
				return null;
			}

			// Find the associated shared device
		}
		else {

			// Check for the special '.' directory, just return the current working directory

			if ( path.equals(".") || path.length() == 0)
				return m_cwd;

			// Check for the special '..' directory, if already at the root directory return an
			// error

			if ( path.equals("..")) {

				// Check if we are already at the root path

				if ( m_cwd.isRootPath() == false) {

					// Remove the last directory from the path

					m_cwd.removeDirectory();

					// Return the new path

					return m_cwd;
				}
				else
					return null;
			}

			// Create a copy of the current working directory and append the new file/directory name

			ftpPath = new FTPPath(m_cwd);

			// Check if the root directory/share has been set

			
				if (filePath)
					ftpPath.addFile(path);
				else
					ftpPath.addDirectory(path);
		}

		// Return the new path

		return ftpPath;
	}

	/**
	 * Convert a path string from share path seperators to FTP path seperators
	 * 
	 * @param path String
	 * @return String
	 */
	protected final String convertToFTPSeperators(String path) {

		// Check if the path is valid

		if ( path == null || path.indexOf(DIR_SEPERATOR) == -1)
			return path;

		// Replace the path seperators

		return path.replace(DIR_SEPERATOR_CHAR, FTP_SEPERATOR_CHAR);
	}

	/**
	 * Set the binary mode flag
	 * 
	 * @param bin boolean
	 */
	protected final void setBinary(boolean bin) {
		m_binary = bin;
	}

	/**
	 * Send an FTP command response
	 * 
	 * @param stsCode int
	 * @param msg String
	 * @exception IOException
	 */
	public final void sendFTPResponse(int stsCode, String msg)
		throws IOException {

		// Build the output record

		StringBuffer outbuf = new StringBuffer(10 + (msg != null ? msg.length() : 0));
		outbuf.append(stsCode);
		outbuf.append(" ");

		if ( msg != null)
			outbuf.append(msg);

		// Add the CR/LF

		outbuf.append(CRLF);

		// Output the FTP response

		if ( m_out != null) {
			m_out.write(outbuf.toString());
			m_out.flush();
		}
	}

	/**
	 * Send an FTP command response
	 * 
	 * @param msg StringBuffer
	 * @exception IOException
	 */
	public final void sendFTPResponse(StringBuffer msg)
		throws IOException {

		// Output the FTP response

		if ( m_out != null) {
			m_out.write(msg.toString());
			m_out.write(CRLF);
			m_out.flush();
		}
	}

	/**
	 * Send an FTP command response
	 * 
	 * @param msg String
	 * @exception IOException
	 */
	public final void sendFTPResponse(String msg)
		throws IOException {

		// Output the FTP response

		if ( m_out != null) {
			m_out.write(msg);
			m_out.write(CRLF);
			m_out.flush();
		}
	}

	/**
	 * Process a user command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procUser(FTPRequest req)
		throws IOException {

		// Clear the current client information

		setClientInformation(null);
		setLoggedOn(false);

		// Check if a user name has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error in parameters or arguments");
			return;
		}
		// Create client information for the user

		setClientInformation(ClientInfo.createInfo(req.getArgument(), null));

		// Valid user, wait for the password

		sendFTPResponse(331, "User name okay, need password for " + req.getArgument());
	}

	/**
	 * Process a password command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procPassword(FTPRequest req)
		throws IOException {

		
		
		// Check if the client information has been set, this indicates a user command has been
		// received

		if ( hasClientInformation() == false) {
			sendFTPResponse(500, "Syntax error, command " + FTPCommand.getCommandName(req.isCommand()) + " unrecognized");
			return;
		}

		// Check for an anonymous login, accept any password string

		if ( getClientInformation().isGuest()) {

			// Save the anonymous login password string

			getClientInformation().setPassword(req.getArgument());

			// Accept the login
			setLoggedOn(true);
			sendFTPResponse(230, "User logged in, proceed");
		}

		// Validate the user

		else {

			// Get the client information and store the received plain text password
			getClientInformation().setPassword(req.getArgument());

			// Authenticate the user

			FTPAuthenticator auth = getFTPServer().getFTPConfiguration().getFTPAuthenticator();

			if ( 
				auth.authenticateUser(getClientInformation(), this) == true) {
				
				// User successfully logged on

				sendFTPResponse(230, "User logged in, proceed");
				setLoggedOn(true);

							}
			else {

				// Return an access denied error

				sendFTPResponse(530, "Access denied");

			}
		}

		// If the user has successfully logged on to the FTP server then inform listeners

		if ( isLoggedOn())
			getFTPServer().sessionLoggedOn(this);
	}

	/**
	 * Process a port command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procPort(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if the parameter has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Required argument missing");
			return;
		}

		// Parse the address/port string into a IP address and port

		StringTokenizer token = new StringTokenizer(req.getArgument(), ",");
		if ( token.countTokens() != 6) {
			sendFTPResponse(501, "Invalid argument");
			return;
		}

		// Parse the client address

		String addrStr = token.nextToken() + "." + token.nextToken() + "." + token.nextToken() + "." + token.nextToken();
		InetAddress addr = null;

		try {
			addr = InetAddress.getByName(addrStr);
		}
		catch (UnknownHostException ex) {
			sendFTPResponse(501, "Invalid argument (address)");
			return;
		}

		// Parse the client port

		int port = -1;

		try {
			port = Integer.parseInt(token.nextToken()) * 256;
			port += Integer.parseInt(token.nextToken());
		}
		catch (NumberFormatException ex) {
			sendFTPResponse(501, "Invalid argument (port)");
			return;
		}

		// Create an active data session, the actual socket connection will be made later

		m_dataSess = getFTPServer().allocateDataSession(this, addr, port);

		// Return a success response to the client

		sendFTPResponse(200, "Port OK");

	}

	/**
	 * Process a passive command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procPassive(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Create a passive data session

		try {
			m_dataSess = getFTPServer().allocatePassiveDataSession(this, m_sock.getLocalAddress());
		}
		catch (IOException ex) {
			m_dataSess = null;
		}

		// Check if the data session is valid

		if ( m_dataSess == null) {
			sendFTPResponse(550, "Requested action not taken");
			return;
		}

		// Get the passive connection address/port and return to the client

		int pasvPort = m_dataSess.getPassivePort();

		StringBuffer msg = new StringBuffer();

		msg.append("227 Entering Passive Mode (");
		msg.append(getLocalFTPAddressString());
		msg.append(",");
		msg.append(pasvPort >> 8);
		msg.append(",");
		msg.append(pasvPort & 0xFF);
		msg.append(")");

		sendFTPResponse(msg);

	}

	/**
	 * Process a print working directory command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procPrintWorkDir(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Return the current working directory virtual path

		sendFTPResponse(257, "\"" + m_cwd.getFTPPath() + "\"");

	}

	/**
	 * Process a change working directory command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procChangeWorkDir(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if the request has a valid argument

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Path not specified");
			return;
		}

		// Create the new working directory path
		
		FTPPath newPath = generatePathForRequest(req, false, true);
		if ( newPath == null) {
			sendFTPResponse(550, "Invalid path " + req.getArgument());
			return;
		}

		// Set the new current working directory

		m_cwd = newPath;

		// Return a success status

		sendFTPResponse(250, "Requested file action OK");

	}

	/**
	 * Process a change directory up command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procCdup(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if there is a current working directory path

		if ( m_cwd.isRootPath()) {

			// Already at the root directory, return an error status

			sendFTPResponse(550, "Already at root directory");
			return;
		}
		else {

			// Remove the last directory from the path

			m_cwd.removeDirectory();
		}

		// Return a success status

		sendFTPResponse(250, "Requested file action OK");

	}

	/**
	 * Process a long directory listing command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procList(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if the client has requested hidden files, via the '-a' option

		boolean hidden = false;

		if ( req.hasArgument() && req.getArgument().startsWith(LIST_OPTION_PREFIX)) {

			// We only support the hidden files option

			String arg = req.getArgument();
			if ( arg.indexOf(LIST_OPTION_HIDDEN) != -1) {

				// Indicate that we want hidden files in the listing

				hidden = true;
			}

			// Remove the option from the command argument, and update the
			// request

			int pos = arg.indexOf(" ");
			if ( pos > 0)
				arg = arg.substring(pos + 1);
			else
				arg = null;

			req.updateArgument(arg);
		}

		// Create the path for the file listing

		FTPPath ftpPath = m_cwd;
		/*
		if ( req.hasArgument())
			ftpPath = generatePathForRequest(req, true, WildCard.containsWildcards(req.getArgument()) ? false : true);
		 */
		if ( ftpPath == null) {
			sendFTPResponse(500, "Invalid path");
			return;
		}

		// Check if the session has the required access
		/*
		if ( ftpPath.isRootPath() == false) {

			// Check if the session has access to the filesystem

			TreeConnection tree = getTreeConnection(ftpPath.getSharedDevice());
			if ( tree == null || tree.hasReadAccess() == false) {

				// Session does not have access to the filesystem

				sendFTPResponse(550, "Access denied");
				return;
			}
		}
		 */
		// Send the intermediate response

		sendFTPResponse(150, "File status okay, about to open data connection");

		// Check if there is an active data session

		if ( m_dataSess == null) {
			sendFTPResponse(425, "Can't open data connection");
			return;
		}

		// Get the data connection socket

		Socket dataSock = null;

		try {
			dataSock = m_dataSess.getSocket();
		}
		catch (Exception ex) {
		}

		if ( dataSock == null) {
			sendFTPResponse(426, "Connection closed; transfer aborted");
			return;
		}

		// Output the directory listing to the client

		Writer dataWrt = null;

		try {
			// Open an output stream to the client

			if ( isUTF8Enabled())
				dataWrt = new OutputStreamWriter(dataSock.getOutputStream(), "UTF-8");
			else
				dataWrt = new OutputStreamWriter(dataSock.getOutputStream());

			// Check if a path has been specified to list

			Vector<Object> files = null;

			if ( req.hasArgument()) {
			}

			// Get a list of file information objects for the current directory

			files = listFilesForPath(ftpPath, false, hidden);

			// Output the file list to the client

			if ( files != null) {
				
				// Output the file information to the client

				StringBuffer str = new StringBuffer(256);

				for (int i = 0; i < files.size(); i++) {

					// Get the current file information

					FileInfo finfo = (FileInfo) files.elementAt(i);

					// Build the output record

					str.setLength(0);

					str.append(finfo.isDirectory() ? "d" : "-");
					str.append("rw-rw-rw-   1 user group ");
					str.append(finfo.getSize());
					str.append(" ");

					FTPDate.packUnixDate(str, new Date(finfo.getModifyDateTime()));

					str.append(" ");

					str.append(finfo.getFileName());
					str.append(CRLF);

					// Output the file information record

					dataWrt.write(str.toString());
					dataWrt.flush();
				}
			}

			// End of file list transmission
			sendFTPResponse(226, "Closing data connection");
		}
		catch (Exception ex) {
			// Failed to send file listing

			sendFTPResponse(451, "Error reading file list");
		}
		finally {

			// Close the data stream to the client

			if ( dataWrt != null)
				dataWrt.close();

			// Close the data connection to the client

			if ( m_dataSess != null) {
				getFTPServer().releaseDataSession(m_dataSess);
				m_dataSess = null;
			}
		}
	}

	/**
	 * Process a short directory listing command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procNList(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Create the path for the file listing

		FTPPath ftpPath = m_cwd;
		if ( req.hasArgument())
			ftpPath = generatePathForRequest(req, true);

		if ( ftpPath == null) {
			sendFTPResponse(500, "Invalid path");
			return;
		}

		// Check if the session has the required access
		/*
		if ( ftpPath.isRootPath() == false) {

			// Check if the session has access to the filesystem

			TreeConnection tree = getTreeConnection(ftpPath.getSharedDevice());
			if ( tree == null || tree.hasReadAccess() == false) {

				// Session does not have access to the filesystem

				sendFTPResponse(550, "Access denied");
				return;
			}
		}
		 */
		// Send the intermediate response

		sendFTPResponse(150, "File status okay, about to open data connection");

		// Check if there is an active data session

		if ( m_dataSess == null) {
			sendFTPResponse(425, "Can't open data connection");
			return;
		}

		// Get the data connection socket

		Socket dataSock = null;

		try {
			dataSock = m_dataSess.getSocket();
		}
		catch (Exception ex) {
		}

		if ( dataSock == null) {
			sendFTPResponse(426, "Connection closed; transfer aborted");
			return;
		}

		// Output the directory listing to the client

		Writer dataWrt = null;

		try {

			// Open an output stream to the client

			if ( isUTF8Enabled())
				dataWrt = new OutputStreamWriter(dataSock.getOutputStream(), "UTF-8");
			else
				dataWrt = new OutputStreamWriter(dataSock.getOutputStream());

			// Check if a path has been specified to list

			Vector files = null;

			if ( req.hasArgument()) {
			}

			// Get a list of file information objects for the current directory

			files = listFilesForPath(ftpPath, false, false);

			// Output the file list to the client

			if ( files != null) {
				// Output the file information to the client

				for (int i = 0; i < files.size(); i++) {

					// Get the current file information

					FileInfo finfo = (FileInfo) files.elementAt(i);

					// Output the file information record

					dataWrt.write(finfo.getFileName());
					dataWrt.write(CRLF);
				}
			}

			// End of file list transmission

			sendFTPResponse(226, "Closing data connection");
		}
		catch (Exception ex) {

			// Failed to send file listing

			sendFTPResponse(451, "Error reading file list");
		}
		finally {

			// Close the data stream to the client

			if ( dataWrt != null)
				dataWrt.close();

			// Close the data connection to the client

			if ( m_dataSess != null) {
				getFTPServer().releaseDataSession(m_dataSess);
				m_dataSess = null;
			}
		}
	}

	/**
	 * Process a system status command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procSystemStatus(FTPRequest req)
		throws IOException {

		// Return the system type

		sendFTPResponse(215, "UNIX Type: G-QU.NET FTP Server");
	}

	/**
	 * Process a server status command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procServerStatus(FTPRequest req)
		throws IOException {

		// Return server status information

		sendFTPResponse(211, "JLAN Server - G-QU.NET FTP Server");
	}

	/**
	 * Process a help command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procHelp(FTPRequest req)
		throws IOException {

		// Return help information

		sendFTPResponse(211, "HELP text");
	}

	/**
	 * Process a no-op command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procNoop(FTPRequest req)
		throws IOException {

		// Return a response

		sendFTPResponse(200, "");
	}

	/**
	 * Process an options request
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procOptions(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if the parameter has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Required argument missing");
			return;
		}

		// Parse the argument to get the sub-command and arguments

		StringTokenizer token = new StringTokenizer(req.getArgument(), " ");
		if ( token.hasMoreTokens() == false) {
			sendFTPResponse(501, "Invalid argument");
			return;
		}

		// Get the sub-command

		String optsCmd = token.nextToken();

		// UTF8 enable/disable command

		if ( FeatureUTF8 && optsCmd.equalsIgnoreCase("UTF8")) {

			// Get the next argument

			if ( token.hasMoreTokens()) {
				String optsArg = token.nextToken();
				if ( optsArg.equalsIgnoreCase("ON")) {

					// Enable UTF-8 file names

					m_utf8Paths = true;
				}
				else if ( optsArg.equalsIgnoreCase("OFF")) {

					// Disable UTF-8 file names

					m_utf8Paths = false;
				}
				else {

					// Invalid argument

					sendFTPResponse(501, "OPTS UTF8 Invalid argument");
					return;
				}

				// Report the new setting back to the client

				sendFTPResponse(200, "OPTS UTF8 " + (isUTF8Enabled() ? "ON" : "OFF"));
			}
		}

		// MLST/MLSD fact list command

		else if ( FeatureMLST && optsCmd.equalsIgnoreCase("MLST")) {

			// Check if the fact list argument is valid

			if ( token.hasMoreTokens() == false) {

				// Invalid fact list argument

				sendFTPResponse(501, "OPTS MLST Invalid argument");
				return;
			}

			// Parse the supplied fact names

			int mlstFacts = 0;
			StringTokenizer factTokens = new StringTokenizer(token.nextToken(), ";");
			StringBuffer factStr = new StringBuffer();

			while (factTokens.hasMoreTokens()) {

				// Get the current fact name and validate

				String factName = factTokens.nextToken();
				int factIdx = -1;
				int idx = 0;

				while (idx < _factNames.length && factIdx == -1) {
					if ( _factNames[idx].equalsIgnoreCase(factName))
						factIdx = idx;
					else
						idx++;
				}

				// Check if the fact name is valid, ignore invalid names

				if ( factIdx != -1) {

					// Add the fact name to the reply tring

					factStr.append(_factNames[factIdx]);
					factStr.append(";");

					// Add the fact to the fact bit mask

					mlstFacts += (1 << factIdx);
				}
			}

			// check if any valid fact names were found

			if ( mlstFacts == 0) {
				sendFTPResponse(501, "OPTS MLST Invalid Argument");
				return;
			}

			// Update the MLST enabled fact list for this session

			m_mlstFacts = mlstFacts;

			// Send the response

			sendFTPResponse(200, "MLST OPTS " + factStr.toString());
		}
		else {

			// Unknown options request or feature not enabled

			sendFTPResponse(501, "Invalid argument");
		}
	}

	/**
	 * Process a quit command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procQuit(FTPRequest req)
		throws IOException {

		// Return a response

		sendFTPResponse(221, "Bye");
		closeSession();
	}

	/**
	 * Process a type command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procType(FTPRequest req)
		throws IOException {

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Check if ASCII or binary mode is enabled

		String arg = req.getArgument().toUpperCase();
		if ( arg.startsWith("A"))
			setBinary(false);
		else if ( arg.startsWith("I") || arg.startsWith("L"))
			setBinary(true);
		else {

			// Invalid argument
			sendFTPResponse(501, "Syntax error, invalid parameter");
			return;
		}

		// Return a success status

		sendFTPResponse(200, "Command OK");
	}

	/**
	 * Process a restart command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procRestart(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Validate the restart position

		try {
			m_restartPos = Integer.parseInt(req.getArgument());
		}
		catch (NumberFormatException ex) {
			sendFTPResponse(501, "Invalid restart position");
			return;
		}

		// Return a success status

		sendFTPResponse(350, "Restart OK");
	}

	/**
	 * Process a return file command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procReturnFile(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Create the path for the file listing

		FTPPath ftpPath = generatePathForRequest(req, true);
		if ( ftpPath == null) {
			sendFTPResponse(500, "Invalid path");
			return;
		}

		// Check if the path is the root directory
		if ( ftpPath.isRootPath() ) {
			sendFTPResponse(550, "That is a directory");
			return;
		}

		// Send the intermediate response

		sendFTPResponse(150, "Connection accepted");

		// Check if there is an active data session

		if ( m_dataSess == null) {
			sendFTPResponse(425, "Can't open data connection");
			return;
		}

		// Get the data connection socket

		Socket dataSock = null;

		try {
			dataSock = m_dataSess.getSocket();
		}
		catch (Exception ex) {
		}

		if ( dataSock == null) {
			sendFTPResponse(426, "Connection closed; transfer aborted");
			return;
		}

		// Send the file to the client

		OutputStream os = null;

		try {
			AuthenticationUtil.setCurrentUser(getClientInformation().getUser().getName());
			
			File file = rootFile.getByPath(ftpPath.getFTPPath());

			if (file!=null) {
				if (file.isFolder()) {
					sendFTPResponse(500, "Invalid path (existing directory)");
					return;
				} else {
	    			os = dataSock.getOutputStream();
	    			FileCopyUtils.copy(file.getInputStream(), os);
				}
			}
			
			sendFTPResponse(226, "Closing data connection");
			
			getFTPServer().releaseDataSession(m_dataSess);
			m_dataSess = null;
		}
		catch (SocketException ex) {


			// Close the data socket to the client

			if ( m_dataSess != null) {
				m_dataSess.closeSession();
				m_dataSess = null;
			}

			// Indicate that there was an error during transmission of the file data

			sendFTPResponse(426, "Data connection closed by client");
		}
		catch (Exception ex) {

			// Indicate that there was an error during transmission of the file data

			sendFTPResponse(426, "Error during transmission");
		}
		finally {


			if ( os != null)
				os.close();

			// Close the data connection to the client

			if ( m_dataSess != null) {
				getFTPServer().releaseDataSession(m_dataSess);
				m_dataSess = null;
			}
		}
	}

	/**
	 * Process a store file command
	 * 
	 * @param req FTPRequest
	 * @param append boolean
	 * @exception IOException
	 */
	protected final void procStoreFile(FTPRequest req, boolean append)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Create the path for the file listing

		FTPPath ftpPath = generatePathForRequest(req, true, false);
		if ( ftpPath == null) {
			sendFTPResponse(500, "Invalid path");
			return;
		}
		if (!ftpPath.isEditableFile()) {
			sendFTPResponse(500, "Invalid path");
			return;
		}
		// Send the file to the client

		InputStream is = null;
		
        // Flag to indicate if the file should be deleted on close, used if there is an error during the upload
        // and the file did not exist before the upload
        
        boolean deleteOnClose = false;
        
		try {
			AuthenticationUtil.setCurrentUser(getClientInformation().getUser().getName());
			File file = rootFile.getByPath(ftpPath.getFTPPath());
			
			
			
			if (file!=null) {
				if (file.isFolder()) {
					sendFTPResponse(500, "Invalid path (existing directory)");
					return;
				}
				
				//getFTPServer().getRuntime().getNodeService().deleteNode(targetNode);
			} else {
				String parentPath = StringUtils.getParentPath(ftpPath.getFTPPath(), FTP_SEPERATOR);
				String fileName = StringUtils.getFileName(ftpPath.getFTPPath(), FTP_SEPERATOR);
				
				File parentFile = rootFile.getByPath(parentPath);
				
				if (parentFile==null || !parentFile.isFolder()) {
					sendFTPResponse(425, "Can't open data connection");
					return;
				}
				
				sendFTPResponse(150, "File status okay, about to open data connection");
				Socket dataSock = null;
				
				try {
					dataSock = m_dataSess.getSocket();
				}
				catch (Exception ex) {
				}
				
				if ( dataSock == null) {
					sendFTPResponse(426, "Connection closed; transfer aborted");
					return;
				}
				// Open an input stream from the client
				
				is = dataSock.getInputStream();
				if ( m_dataSess == null) {
					sendFTPResponse(425, "Can't open data connection");
					return;
				}
				
				parentFile.createFile(fileName, is);
			}
			sendFTPResponse(226, "Closing data connection");

		} catch (SocketException ex) {

			// Close the data socket to the client

			if ( m_dataSess != null) {
				getFTPServer().releaseDataSession(m_dataSess);
				m_dataSess = null;
			}
			// Indicate that there was an error during transmission of the file data
			sendFTPResponse(426, "Data connection closed by client");
		}
	    catch (Exception ex) 
	    {
			sendFTPResponse(426, "Error during transmission");
		}
		finally {
			if ( m_dataSess != null) {
				getFTPServer().releaseDataSession(m_dataSess);
				m_dataSess = null;
			}
		}
	}

	/**
	 * Process a delete file command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procDeleteFile(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Create the path for the file

		FTPPath ftpPath = generatePathForRequest(req, true);
		if ( ftpPath == null) {
			sendFTPResponse(550, "Invalid path specified");
			return;
		}



		try {
			
			File file = rootFile.getByPath(ftpPath.getSharePath());
			
			if (file!=null) {
				file.remove();
				sendFTPResponse(250, "File " + req.getArgument() + " deleted");
			} else {
				sendFTPResponse(450, "File action not taken");
			}
		}
		catch (Exception ex) {
			sendFTPResponse(450, "File action not taken");
		}
	}

	/**
	 * Process a rename from command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procRenameFrom(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Clear the current rename from path details, if any

		m_renameFrom = null;

		// Create the path for the file/directory

		FTPPath ftpPath = generatePathForRequest(req, false, false);
		if ( ftpPath == null) {
			sendFTPResponse(550, "Invalid path specified");
			return;
		}

		// Check that the file exists, and it is a file
		try {
			m_renameFrom = ftpPath;
			// Create a temporary tree connection


			// Check if the session has the required access to the filesystem
			/*
			if ( tree == null || tree.hasWriteAccess() == false) {

				// Session does not have write access to the filesystem

				sendFTPResponse(550, "Access denied");
				return;
			}
*/
			// Check if the file exists and it is a file

			/*
			if ( sts != FileStatus.NotExist) {

				// Save the rename from file details, rename to command should follow

				m_renameFrom = ftpPath;
			}
			else {

				// File/directory does not exist

				sendFTPResponse(550, "File " + req.getArgument()
						+ (sts == FileStatus.NotExist ? " not available" : " is a directory"));
				return;
			}
			*/
		}
		catch (Exception ex) {
			sendFTPResponse(450, "File action not taken");
			return;
		}

		// Return a success status

		sendFTPResponse(350, "File " + req.getArgument() + " OK");
	}

	/**
	 * Process a rename to command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procRenameTo(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Check if the rename from has already been set

		if ( m_renameFrom == null) {
			sendFTPResponse(550, "Rename from not set");
			return;
		}

		/*if ( !m_renameFrom.isEditableFile()) {
			sendFTPResponse(550, "You can not rename an application");
			return;
		}
*/
		
		// Create the path for the new file name

		FTPPath ftpPath = generatePathForRequest(req, true, false);
		if ( ftpPath == null) {
			sendFTPResponse(550, "Invalid path specified");
			return;
		}

		if (!ftpPath.isEditableFile()) {
			sendFTPResponse(550, "Rename to can not be modified");
			return;
		}
		
		if (!m_renameFrom.getShareName().equals(ftpPath.getShareName())) {
			sendFTPResponse(550, "Can not move file across application");
			return;
		}
		try {
			String o_parent = StringUtils.getParentPath(m_renameFrom.getFTPPath(), FTP_SEPERATOR);
			String t_parent = StringUtils.getParentPath(ftpPath.getFTPPath(), FTP_SEPERATOR);
			String t_name = StringUtils.getFileName(ftpPath.getFTPPath(), FTP_SEPERATOR);
			
			File file = rootFile.getByPath(m_renameFrom.getFTPPath());
			
			
			if (file == null) {
				sendFTPResponse(550, "File " + req.getArgument() + " not abailable");
				return;				
			}
			
			if (o_parent.equals(t_parent) && !m_renameFrom.getSharePath().equals(ftpPath.getSharePath())) {
				//父路径相同  重命名
				file.rename(t_name);
			} else {
				//否则是移动
				
				File parent = rootFile.getByPath(t_parent);
				if (parent==null || !parent.isFolder()) {
					sendFTPResponse(550, "Rename to parent " + t_parent + " not abailable");
					return;					
				}
				file.moveTo(parent, true);
				
			}
		}
		catch (Exception ex) {
			sendFTPResponse(450, "File action not taken");
			return;
		}
		finally {
			m_renameFrom = null;
		}

		// Return a success status
		sendFTPResponse(250, "File renamed OK");
	}

	/**
	 * Process a create directory command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procCreateDirectory(FTPRequest req)
		throws IOException {
		AuthenticationUtil.setCurrentUser(getClientInformation().getUser().getName());
		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		if (m_cwd.isRootPath()) {
			sendFTPResponse(550, "You can not create dir in the ftp root. to create an application, go to the website");
			return;
		}
		
		// Check if the new directory contains multiple directories

		FTPPath ftpPath = generatePathForRequest(req, false, false);

		// Create the new directory
		try {
			String parentPath = StringUtils.getParentPath(ftpPath.getFTPPath(), FTP_SEPERATOR);
	        String folderName =  StringUtils.getFileName(ftpPath.getFTPPath(), FTP_SEPERATOR);
		    
	        File parentFile = rootFile.getByPath(parentPath);
	        
	        if (parentFile==null || !parentFile.isFolder()) {
	        	sendFTPResponse(550, "Access denied");
	        	return;
	        }
	        
	        parentFile.createFolder(folderName);
	        
            sendFTPResponse(250, ftpPath.getFTPPath());
		
            /*// Create a temporary tree connection

			tree = getTreeConnection(ftpPath.getSharedDevice());

			// Check if the session has the required access to the filesystem

			if ( tree == null || tree.hasWriteAccess() == false) {

				// Session does not have write access to the filesystem

				sendFTPResponse(550, "Access denied");
				return;
			}

			// Check if the directory exists

			disk = (DiskInterface) ftpPath.getSharedDevice().getInterface();
			int sts = disk.fileExists(this, tree, ftpPath.getSharePath());

			if ( sts == FileStatus.NotExist) {

				// Create the new directory

				FileOpenParams params = new FileOpenParams(ftpPath.getSharePath(), FileAction.CreateNotExist,
						AccessMode.ReadWrite, FileAttribute.NTDirectory, 0);

				disk.createDirectory(this, tree, params);

				// Notify change listeners that a new directory has been created

				DiskDeviceContext diskCtx = (DiskDeviceContext) tree.getContext();

				if ( diskCtx.hasChangeHandler())
					diskCtx.getChangeHandler().notifyFileChanged(NotifyChange.ActionAdded, ftpPath.getSharePath());

				// DEBUG

				if ( Debug.EnableInfo && hasDebug(DBG_DIRECTORY))
					debugPrintln("CreateDir ftp=" + ftpPath.getFTPPath() + ", share=" + ftpPath.getShareName() + ", path="
							+ ftpPath.getSharePath());
			}
			else {

				// File/directory already exists with that name, return an error

				sendFTPResponse(450, sts == FileStatus.FileExists ? "File exists with that name" : "Directory already exists");
				return;
			} */
		} catch (Exception ex) {
			sendFTPResponse(450, "Failed to create directory");
			return;
		}
		// Return the FTP path to the client

	}

	/**
	 * Process a delete directory command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procRemoveDirectory(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Check if the directory path contains multiple directories

		FTPPath ftpPath = generatePathForRequest(req, false);
		if ( ftpPath == null) {
			sendFTPResponse(550, "Invalid path " + req.getArgument());
			return;
		}

		// Check if the path is the root directory, cannot delete directories from the root
		// directory
		// as it maps to the list of available disk shares.

		if ( ftpPath.isRootPath()) {
			sendFTPResponse(550, "Access denied, cannot delete directory in root");
			return;
		}

		if (ftpPath.getSharePath()==null || ftpPath.getSharePath().equals(FTP_SEPERATOR) ) {
			sendFTPResponse(550, "Access denied, cannot delete directory in root");
			return;
		}
		// Delete the directory

		try {
			
			AuthenticationUtil.setCurrentUser(getClientInformation().getUser().getName());
			
			File target = rootFile.getByPath(ftpPath.getSharePath());
			if (target!=null) {
				target.remove();
			}
			// Create a temporary tree connection
/*
			tree = getTreeConnection(ftpPath.getSharedDevice());

			// Check if the session has the required access to the filesystem

			if ( tree == null || tree.hasWriteAccess() == false) {

				// Session does not have write access to the filesystem

				sendFTPResponse(550, "Access denied");
				return;
			}

			// Check if the directory exists

			disk = (DiskInterface) ftpPath.getSharedDevice().getInterface();
			int sts = disk.fileExists(this, tree, ftpPath.getSharePath());

			if ( sts == FileStatus.DirectoryExists) {

				// Delete the new directory

				disk.deleteDirectory(this, tree, ftpPath.getSharePath());

				// Check if there are any file/directory change notify requests active

				DiskDeviceContext diskCtx = (DiskDeviceContext) tree.getContext();
				if ( diskCtx.hasChangeHandler())
					diskCtx.getChangeHandler().notifyFileChanged(NotifyChange.ActionRemoved, ftpPath.getSharePath());

				// DEBUG

				if ( Debug.EnableInfo && hasDebug(DBG_DIRECTORY))
					debugPrintln("DeleteDir ftp=" + ftpPath.getFTPPath() + ", share=" + ftpPath.getShareName() + ", path="
							+ ftpPath.getSharePath());
			}
			else {

				// File already exists with that name or directory does not exist return an error

				sendFTPResponse(550, sts == FileStatus.FileExists ? "File exists with that name" : "Directory does not exist");
				return;
			}*/
		}
		catch (Exception ex) {
			sendFTPResponse(550, "Failed to delete directory");
			return;
		}

		// Return a success status

		sendFTPResponse(250, "Directory deleted OK");
	}

	/**
	 * Process a machine listing request, single folder
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procMachineListing(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPResponse(530, "Not logged in");
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Create the path to be listed

		FTPPath ftpPath = generatePathForRequest(req, false, true);
		if ( ftpPath == null) {
			sendFTPResponse(500, "Invalid path");
			return;
		}

		// Get the file information
		try {

		/*	// Create a temporary tree connection

			tree = getTreeConnection(ftpPath.getSharedDevice());

			// Access the virtual filesystem driver

			disk = (DiskInterface) ftpPath.getSharedDevice().getInterface();

			// Get the file information

			FileInfo finfo = disk.getFileInformation(this, tree, ftpPath.getSharePath());

			if ( finfo == null) {
				sendFTPResponse(550, "Path " + req.getArgument() + " not available");
				return;
			}
			else if ( finfo.isDirectory() == false) {
				sendFTPResponse(501, "Path " + req.getArgument() + " is not a directory");
				return;
			}

			// Return the folder details

			sendFTPResponse("250- Listing " + req.getArgument());

			StringBuffer mlstStr = new StringBuffer(80);
			mlstStr.append(" ");

			generateMlstString(finfo, m_mlstFacts, mlstStr, true);
			mlstStr.append(CRLF);

			sendFTPResponse(mlstStr.toString());
			sendFTPResponse("250 End");

			// DEBUG

			if ( Debug.EnableInfo && hasDebug(DBG_FILE))
				debugPrintln("Mlst ftp=" + ftpPath.getFTPPath() + ", share=" + ftpPath.getShareName() + ", info=" + finfo);
*/		}
		catch (Exception ex) {
			sendFTPResponse(550, "Error retrieving file information");
		}
	}

	/**
	 * Process a machine listing request, folder contents
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procMachineListingContents(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if the request has an argument, if not then use the current working directory

		if ( req.hasArgument() == false)
			req.updateArgument(".");

		// Create the path for the file listing

		FTPPath ftpPath = m_cwd;
		if ( req.hasArgument())
			ftpPath = generatePathForRequest(req, true);

		if ( ftpPath == null) {
			sendFTPResponse(500, "Invalid path");
			return;
		}

		// Check if the session has the required access

		// Send the intermediate response

		sendFTPResponse(150, "File status okay, about to open data connection");

		// Check if there is an active data session

		if ( m_dataSess == null) {
			sendFTPResponse(425, "Can't open data connection");
			return;
		}

		// Get the data connection socket

		Socket dataSock = null;

		try {
			dataSock = m_dataSess.getSocket();
		}
		catch (Exception ex) {
		}

		if ( dataSock == null) {
			sendFTPResponse(426, "Connection closed; transfer aborted");
			return;
		}

		// Output the directory listing to the client

		Writer dataWrt = null;

		try {

			// Open an output stream to the client

			if ( isUTF8Enabled())
				dataWrt = new OutputStreamWriter(dataSock.getOutputStream(), "UTF-8");
			else
				dataWrt = new OutputStreamWriter(dataSock.getOutputStream());

			// Get a list of file information objects for the current directory

			Vector<Object> files = null;

			files = listFilesForPath(ftpPath, false, false);

			// Output the file list to the client

			if ( files != null) {

				// Output the file information to the client

				StringBuffer str = new StringBuffer(MLSD_BUFFER_SIZE);

				for (int i = 0; i < files.size(); i++) {

					// Get the current file information

					FileInfo finfo = (FileInfo) files.elementAt(i);

					generateMlstString(finfo, m_mlstFacts, str, false);
					str.append(CRLF);

					// Output the file information record when the buffer is full

					if ( str.length() >= MLSD_BUFFER_SIZE) {

						// Output the file data records

						dataWrt.write(str.toString());

						// Reset the buffer

						str.setLength(0);
					}
				}

				// Flush any remaining file record data

				if ( str.length() > 0)
					dataWrt.write(str.toString());
			}

			// End of file list transmission

			sendFTPResponse(226, "Closing data connection");
		}
		catch (Exception ex) {

			// Failed to send file listing

			sendFTPResponse(451, "Error reading file list");
		}
		finally {

			// Close the data stream to the client

			if ( dataWrt != null)
				dataWrt.close();

			// Close the data connection to the client

			if ( m_dataSess != null) {
				getFTPServer().releaseDataSession(m_dataSess);
				m_dataSess = null;
			}
		}
	}

	/**
	 * Process a modify date/time command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procModifyDateTime(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Check the format of the argument to detemine if this is a get or set modify date/time
		// request
		//
		// Get format is just the filename/path
		// Set format is YYYYMMDDHHMMSS <path>

		String path = req.getArgument();
		long modifyDateTime = 0L;

		if ( path.length() > MDTM_DATETIME_MINLEN && path.indexOf(' ') != -1) {

			// Check if the first argument looks like a date/time value

			boolean settime = true;
			for (int i = 0; i < MDTM_DATETIME_MINLEN; i++) {
				if ( Character.isDigit(path.charAt(i)) == false)
					settime = false;
			}

			// Looks like a date/time value

			if ( settime == true) {

				try {

					// Parse the various fields

					int year = Integer.valueOf(path.substring(0, 4)).intValue();
					int month = Integer.valueOf(path.substring(4, 6)).intValue();
					int day = Integer.valueOf(path.substring(6, 8)).intValue();

					int hours = Integer.valueOf(path.substring(8, 10)).intValue();
					int mins = Integer.valueOf(path.substring(10, 12)).intValue();
					int secs = Integer.valueOf(path.substring(12, 14)).intValue();

					// Check if the date/time includes milliseconds

					int millis = 0;
					int sep = path.indexOf(' ', MDTM_DATETIME_MINLEN);

					if ( path.charAt(MDTM_DATETIME_MINLEN) == '.') {

						// Find the seperator between the date/time and path

						millis = Integer.valueOf(path.substring(MDTM_DATETIME_MINLEN + 1, sep)).intValue();
					}

					// Create the modify date/time

					Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"));

					cal.set(year, month, day, hours, mins, secs);
					if ( millis != 0)
						cal.set(Calendar.MILLISECOND, millis);

					// Get the modify date/time

					modifyDateTime = cal.getTimeInMillis();

					// Remove the date/time from the request argument

					path = path.substring(sep + 1);
					req.updateArgument(path);

				}
				catch (NumberFormatException ex) {
				}
			}
		}

		// Create the path for the file listing

		FTPPath ftpPath = generatePathForRequest(req, true);
		if ( ftpPath == null) {
			sendFTPResponse(550, "Invalid path");
			return;
		}

		// Get the file information

		try {

			// Create a temporary tree connection

/*			tree = getTreeConnection(ftpPath.getSharedDevice());

			// Access the virtual filesystem driver

			disk = (DiskInterface) ftpPath.getSharedDevice().getInterface();

			// Check if the modify date/time should be set

			if ( modifyDateTime != 0L) {

				// Set the file/folder modification date/time

				FileInfo finfo = new FileInfo();
				finfo.setModifyDateTime(modifyDateTime);
				finfo.setFileInformationFlags(FileInfo.SetModifyDate);

				disk.setFileInformation(this, tree, ftpPath.getSharePath(), finfo);
			}

			// Get the file information

			FileInfo finfo = disk.getFileInformation(this, tree, ftpPath.getSharePath());

			if ( finfo == null) {
				sendFTPResponse(550, "File " + req.getArgument() + " not available");
				return;
			}

			// Return the file modification date/time

			if ( finfo.hasModifyDateTime())
				sendFTPResponse(213, FTPDate.packMlstDateTime(finfo.getModifyDateTime()));
			else
				sendFTPResponse(550, "Modification date/time not available for " + finfo.getFileName());

			// DEBUG

			if ( Debug.EnableInfo && hasDebug(DBG_FILE))
				debugPrintln("File modify date/time ftp=" + ftpPath.getFTPPath() + ", share=" + ftpPath.getShareName()
						+ ", modified=" + finfo.getModifyDateTime());
*/		}
		catch (Exception ex) {
			sendFTPResponse(550, "Error retrieving file modification date/time");
		}
	}

	/**
	 * Process a server features request
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procFeatures(FTPRequest req)
		throws IOException {

		// Return the list of supported server features

		sendFTPResponse("211-Features supported");

		// MOdify date/time and size commands supported

		if ( FeatureMDTM)
			sendFTPResponse(" MDTM");

		if ( FeatureSIZE)
			sendFTPResponse(" SIZE");

		if ( FeatureUTF8)
			sendFTPResponse(" UTF8");

		// Machine listing supported, build the fact list

		if ( FeatureMLST) {
			StringBuffer mlstStr = new StringBuffer();

			mlstStr.append(" MLST ");

			for (int i = 0; i < _factNames.length; i++) {

				// Output the fact name

				mlstStr.append(_factNames[i]);

				// Check if the fact is enabled by default

				if ( (MLST_DEFAULT & (1 << i)) != 0)
					mlstStr.append("*");
				mlstStr.append(";");
			}

			sendFTPResponse(mlstStr.toString());
			sendFTPResponse(" MLSD");
		}

		sendFTPResponse(211, "END");
	}

	/**
	 * Process a file size command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procFileSize(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if an argument has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Syntax error, parameter required");
			return;
		}

		// Create the path for the file listing

		FTPPath ftpPath = generatePathForRequest(req, true);
		if ( ftpPath == null) {
			sendFTPResponse(550, "Invalid path");
			return;
		}

		// Get the file information

		try {

		/*	// Create a temporary tree connection

			tree = getTreeConnection(ftpPath.getSharedDevice());

			// Access the virtual filesystem driver

			disk = (DiskInterface) ftpPath.getSharedDevice().getInterface();

			// Get the file information

			FileInfo finfo = disk.getFileInformation(this, tree, ftpPath.getSharePath());

			if ( finfo == null) {
				sendFTPResponse(550, "File " + req.getArgument() + " not available");
				return;
			}

			// Return the file size

			sendFTPResponse(213, "" + finfo.getSize());

			// DEBUG

			if ( Debug.EnableInfo && hasDebug(DBG_FILE))
				debugPrintln("File size ftp=" + ftpPath.getFTPPath() + ", share=" + ftpPath.getShareName() + ", size="
						+ finfo.getSize());*/
		}
		catch (Exception ex) {
			sendFTPResponse(550, "Error retrieving file size");
		}
	}

	/**
	 * Process a site specific command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procSite(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if the FTP server has a site interface

		// SITE command not implemented

			sendFTPResponse(501, "SITE commands not implemented");
	}

	/**
	 * Process a structure command. This command is obsolete.
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procStructure(FTPRequest req)
		throws IOException {

		// Check for the file structure argument

		if ( req.hasArgument() && req.getArgument().equalsIgnoreCase("F")) {
			
			// Return a success status
		
			sendFTPResponse(200, "OK");
		}
		else {

			// Return an error response
	
			sendFTPResponse(504, "Obsolete");
		}
	}

	/**
	 * Process a mode command. This command is obsolete.
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procMode(FTPRequest req)
		throws IOException {

		// Check for the stream transfer mode argument

		if ( req.hasArgument() && req.getArgument().equalsIgnoreCase("S")) {
			
			// Return a success status
		
			sendFTPResponse(200, "OK");
		}
		else {

			// Return an error response
	
			sendFTPResponse(504, "Obsolete");
		}
	}

	/**
	 * Process an allocate command. This command is obsolete.
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procAllocate(FTPRequest req)
		throws IOException {

		// Return a response

		sendFTPResponse(202, "Obsolete");
	}

	/**
	 * Process an abort command. The main abort processing is done in the store/return file handling
	 * during an active file transfer.
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procAbort(FTPRequest req)
		throws IOException {

		// Return a success response

		sendFTPResponse(226, "No active transfer to abort");
	}

	/**
	 * Process an authentication command for SSL/TLS.
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procAuth(FTPRequest req)
		throws IOException {

		// return a success status

		sendFTPResponse(234, "SSL/TLS testing");
	}

	/**
	 * Process an extended port command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procExtendedPort(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Check if the parameter has been specified

		if ( req.hasArgument() == false) {
			sendFTPResponse(501, "Required argument missing");
			return;
		}

		// Parse the client address
		
		InetSocketAddress clientAddr = parseExtendedAddress( req.getArgument());
		if ( clientAddr == null) {
			sendFTPResponse(501, "Invalid argument");
			return;
		}
			
		m_dataSess = getFTPServer().allocateDataSession(this, clientAddr.getAddress(), clientAddr.getPort());

		// Return a success response to the client

		sendFTPResponse(200, "Port OK");
	}

	/**
	 * Process an extended passive command
	 * 
	 * @param req FTPRequest
	 * @exception IOException
	 */
	protected final void procExtendedPassive(FTPRequest req)
		throws IOException {

		// Check if the user is logged in

		if ( isLoggedOn() == false) {
			sendFTPNotLoggedOnResponse();
			return;
		}

		// Create a passive data session

		try {
			m_dataSess = getFTPServer().allocatePassiveDataSession(this, m_sock.getLocalAddress());
		}
		catch (IOException ex) {
			m_dataSess = null;
		}

		// Check if the data session is valid

		if ( m_dataSess == null) {
			sendFTPResponse(550, "Requested action not taken");
			return;
		}

		// Get the passive connection address/port and return to the client

		int pasvPort = m_dataSess.getPassivePort();

		StringBuffer msg = new StringBuffer();

		msg.append("229 Entering Extended Passive Mode (|||");
		msg.append(pasvPort);
		msg.append("|)");

		sendFTPResponse(msg);
	}

	/**
	 * Parse the extended network address string
	 * 
	 * @param extAddr String
	 * @return InetSocketAddress
	 */
	private final InetSocketAddress parseExtendedAddress( String extAddr) {
	
		// Make sure the string is valid
		
		if ( extAddr == null || extAddr.length() < 7)
			return null;
		
		// Split the string into network type, network address and port strings
		
		StringTokenizer tokens = new StringTokenizer( extAddr, extAddr.substring(0, 1));
		if ( tokens.countTokens() < 3)
			return null;
		
		String netType = tokens.nextToken();
		String netAddr = tokens.nextToken();
		String netPort = tokens.nextToken();
		
		// Check if it is an IPv4 style address
		
		InetSocketAddress sockAddr = null;
		
		if ( netType.equals( TypeIPv4)) {
			
			// Parse the IPv4 network address
			
			InetAddress addr = null;
			
			try {
				addr = InetAddress.getByName( netAddr);
			}
			catch ( UnknownHostException ex) {
				addr = null;
			}

			// Make sure we got an IPv4 address
			
			if ( addr != null && addr instanceof Inet4Address) {
				
				// Parse the port
				
				int port = -1;
				
				try {
					port = Integer.parseInt( netPort);
				}
				catch ( NumberFormatException ex) {
					port = -1;
				}

				// Create the socket address

				if ( port != -1)
					sockAddr = new InetSocketAddress( addr, port);
			}
		}
		else if ( netType.equals( TypeIPv6)) {
			
			// Parse the IPv6 network address
			
			InetAddress addr = null;
			
			try {
				addr = InetAddress.getByName( netAddr);
			}
			catch ( UnknownHostException ex) {
				addr = null;
			}

			// Make sure we got an IPv6 address
			
			if ( addr != null && addr instanceof Inet6Address) {
				
				// Parse the port
				
				int port = -1;
				
				try {
					port = Integer.parseInt( netPort);
				}
				catch ( NumberFormatException ex) {
					port = -1;
				}

				// Check if the scope-id from the original client socket connection needs to be added to
				// the provided address
				
				Inet6Address ip6addr = (Inet6Address) addr;
				
				if ( ip6addr.getScopeId() == 0 && m_sock.getInetAddress() instanceof Inet6Address) {
					
					// Check the client socket scope-id

					Inet6Address clientAddr = (Inet6Address) m_sock.getInetAddress();
					Inet6Address localAddr  = (Inet6Address) m_sock.getLocalAddress();
					
					if ( clientAddr.getScopeId() != 0) {
				
						// Create a client data socket address with a scope-id, to make sure the socket connection
						// gets routed back to the client correctly
						
						try {

							addr = Inet6Address.getByAddress( addr.getHostAddress(), addr.getAddress(), localAddr.getScopeId());
						}
						catch ( UnknownHostException ex) {
							
							// Stick with the original parsed address
						}
					}
				}

				// Create the socket address

				if ( port != -1)
					sockAddr = new InetSocketAddress( addr, port);
			}
		}

		// Return the socket address, or null if an unknown type
		
		return sockAddr;
	}
	
	/**
	 * Build a list of file name or file information objects for the specified server path
	 * 
	 * @param path FTPPath
	 * @param nameOnly boolean
	 * @param hidden boolean
	 * @return Vector<Object>
	 */
	protected final Vector<Object> listFilesForPath(FTPPath path, boolean nameOnly, boolean hidden) {

		// Check if the path is valid

		if ( path == null)
			return null;

		// Check if the path is the root path

		Vector<Object> files = new Vector<Object>();
		
		if (path.isRootPath()) {
			FileInfo finfo = new FileInfo(this.getClientInformation().getUserName(), 0L, FileAttribute.Directory);
			files.add(finfo);
		} else if (path.getFTPPath()!=null) {
			File file = rootFile.getByPath(path.getFTPPath());
			if (file!=null && file.isFolder()) {
				List<File> children = file.getChildren();
				
				for (File child : children) {
					FileInfo fileInfo = null;
					if (child.isFolder()) {
						 fileInfo = new FileInfo(path.getFTPPath() + FTP_SEPERATOR + child.getName(), child.getName(), 
								0L, FileAttribute.Directory);
					} else {
						fileInfo = new FileInfo(path.getFTPPath() + FTP_SEPERATOR + child.getName(), child.getName(), 
								child.getSize(), FileAttribute.Normal);
					}
					fileInfo.setModifyDateTime(file.getModified().getTime());
					files.add(fileInfo);
					//generateResponseForNode(req, xml, childAssoc.getChild(), basePath + childAssoc.getChild().getName());
				}
			}
		}
		
		/*
		if ( path.hasSharedDevice() == false) {

			// The first level of directories are mapped to the available shares

			SharedDeviceList shares = getShareList();
			if ( shares != null) {

				// Search for disk shares

				Enumeration<SharedDevice> enm = shares.enumerateShares();

				while (enm.hasMoreElements()) {

					// Get the current shared device

					SharedDevice shr = enm.nextElement();

					// Add the share name or full information to the list

					if ( nameOnly == false) {

						// Create a file information object for the top level directory details

						FileInfo finfo = new FileInfo(shr.getName(), 0L, FileAttribute.Directory);
						files.add(finfo);
					}
					else
						files.add(shr.getName());
				}
			}
		}
		else {

			// Append a wildcard to the search path

			String searchPath = path.getSharePath();

			if ( path.isDirectory())
				searchPath = path.makeSharePathToFile("*.*");

			// Create a temporary tree connection

			TreeConnection tree = new TreeConnection(path.getSharedDevice());

			// Start a search on the specified disk share

			DiskInterface disk = null;
			SearchContext ctx = null;

			int searchAttr = FileAttribute.Directory + FileAttribute.Normal;
			if ( hidden)
				searchAttr += FileAttribute.Hidden;

			try {
				disk = (DiskInterface) path.getSharedDevice().getInterface();
				ctx = disk.startSearch(this, tree, searchPath, searchAttr);
			}
			catch (Exception ex) {
			}

			// Add the files to the list

			if ( ctx != null) {

				// Get the file names/information

				while (ctx.hasMoreFiles()) {

					// Check if a file name or file information is required

					if ( nameOnly) {

						// Add a file name to the list

						files.addElement(ctx.nextFileName());
					}
					else {

						// Create a file information object

						FileInfo finfo = new FileInfo();

						if ( ctx.nextFileInfo(finfo) == false)
							break;
						if ( finfo.getFileName() != null)
							files.addElement(finfo);
					}
				}
			}
		}
*/
		// Return the list of file names/information

		return files;
	}

	

	/**
	 * Check if an abort command has been sent by the client
	 * 
	 * @return boolean
	 */
	private final boolean checkForAbort() {

		try {

			// Check if there is any pending data on the command socket

			if ( m_in.available() > 0) {

				// Read the next request

				FTPRequest ftpReq = getNextCommand(false);
				if ( ftpReq != null) {

					// Check for an abort command

					if ( ftpReq.isCommand() == FTPCommand.Abor) {
						return true;
					}
					else {

						// Queue the request for processing later

						m_ftpCmdList.add(ftpReq);
					}
				}
			}
		}
		catch (IOException ex) {
		}

		// No command, or not an abort command

		return false;
	}

	/**
	 * Read the next FTP command from the command socket, or get a command from the list of queued
	 * requests
	 * 
	 * @param checkQueue boolean
	 * @return FTPRequest
	 * @exception SocketException
	 * @exception IOException
	 */
	private final FTPRequest getNextCommand(boolean checkQueue)
		throws SocketException, IOException {

		// Check if there are any queued requests

		FTPRequest nextReq = null;

		if ( checkQueue == true && m_ftpCmdList.size() > 0) {

			// Get the next queued request

			nextReq = m_ftpCmdList.remove(0);
		}
		else {

			// Wait for an incoming request
			String cmd = m_reader.readLine();
			
			/*
			int rdlen = m_in.read(m_inbuf);

			// Check if there is no more data, the other side has dropped the connection

			if ( rdlen == -1) {
				closeSession();
				return null;
			}

			// Trim the trailing <CR><LF>

			if ( rdlen > 0) {
				while (rdlen > 0 && m_inbuf[rdlen - 1] == '\r' || m_inbuf[rdlen - 1] == '\n')
					rdlen--;
			}

			// Get the command string, create the new request

			String cmd = null;

			if ( isUTF8Enabled()) {
				cmd = m_normalizer.normalize(new String(m_inbuf, 0, rdlen, "UTF8"));
			}
			else
				cmd = new String(m_inbuf, 0, rdlen);
*/
			nextReq = new FTPRequest(cmd);
		}

		// Return the request

		return nextReq;
	}

	/**
	 * Generate a machine listing string for the specified file/folder information
	 * 
	 * @param finfo FileInfo
	 * @param mlstFlags int
	 * @param buf StringBuffer
	 * @param isMlsd boolean
	 */
	protected final void generateMlstString(FileInfo finfo, int mlstFlags, StringBuffer buf, boolean isMlsd) {

		// Create the machine listing record

		for (int i = 0; i < _factNames.length; i++) {

			// Check if the current fact is enabled

			int curFact = 1 << i;

			if ( (mlstFlags & curFact) != 0) {

				// Output the fact value

				switch (curFact) {

					// File size

					case MLST_SIZE:
						buf.append(_factNames[i]);
						buf.append("=");
						buf.append(finfo.getSize());
						buf.append(";");
						break;

					// Modify date/time

					case MLST_MODIFY:
						if ( finfo.hasModifyDateTime()) {
							buf.append(_factNames[i]);
							buf.append("=");
							buf.append(FTPDate.packMlstDateTime(finfo.getModifyDateTime()));
							buf.append(";");
						}
						break;

					// Creation date/time

					case MLST_CREATE:
						if ( finfo.hasCreationDateTime()) {
							buf.append(_factNames[i]);
							buf.append("=");
							buf.append(FTPDate.packMlstDateTime(finfo.getCreationDateTime()));
							buf.append(";");
						}
						break;

					// Type

					case MLST_TYPE:
						buf.append(_factNames[i]);

						if ( finfo.isDirectory() == false) {
							buf.append("=file;");
						}
						else {
							buf.append("=dir;");
						}
						break;

					// Unique identifier

					case MLST_UNIQUE:
						if ( finfo.getFileId() != -1) {
							buf.append(_factNames[i]);
							buf.append("=");
							buf.append(finfo.getFileId());
							buf.append(";");
						}
						break;

					// Permissions

					case MLST_PERM:
						buf.append(_factNames[i]);
						buf.append("=");
						if ( finfo.isDirectory()) {
							buf.append(finfo.isReadOnly() ? "el" : "ceflmp");
						}
						else {
							buf.append(finfo.isReadOnly() ? "r" : "rwadf");
						}
						buf.append(";");
						break;

					// Media-type

					case MLST_MEDIATYPE:
						break;
				}
			}
		}

		// Add the file name

		buf.append(" ");
		buf.append(finfo.getFileName());
	}

	/**
	 * Return the local IP address as a string in 'n,n,n,n' format
	 * 
	 * @return String
	 */
	private final String getLocalFTPAddressString() {
		return m_sock.getLocalAddress().getHostAddress().replace('.', ',');
	}
	
	/**
	 * Return a not logged status
	 * 
	 * @throws IOException
	 */
	protected final void sendFTPNotLoggedOnResponse()
		throws IOException {
		sendFTPResponse(530, "Not logged on");
	}
	
	/**
	 * Indicate that FTP filesystem searches are case sensitive
	 * 
	 * @return boolean
	 */
	public boolean useCaseSensitiveSearch() {
		return true;
	}
	
	/**
	 * Start the FTP session in a seperate thread
	 */
	public void run() {

		try {
			
			m_in = m_sock.getInputStream();
			InputStreamReader isr = new InputStreamReader(m_in);
			m_reader = new BufferedReader(isr);
			
			m_out = new OutputStreamWriter(m_sock.getOutputStream());

			m_inbuf = new byte[512];
			// Return the initial response

			sendFTPResponse(220, "FTP server ready");

			// Start/end times if timing debug is enabled

			long startTime = 0L;
			long endTime = 0L;

			// The server session loops until the NetBIOS hangup state is set.

			FTPRequest ftpReq = null;

			while (m_sock != null) {

				// Wait for a request

				ftpReq = getNextCommand(true);
				if ( ftpReq == null)
					continue;

				// Parse the received command, and validate
				
				switch (ftpReq.isCommand()) {

					// User command

					case FTPCommand.User:
						procUser(ftpReq);
						break;

					// Password command

					case FTPCommand.Pass:
						procPassword(ftpReq);
						break;

					// Quit command

					case FTPCommand.Quit:
						procQuit(ftpReq);
						break;

					// Type command

					case FTPCommand.Type:
						procType(ftpReq);
						break;

					// Port command

					case FTPCommand.Port:
						procPort(ftpReq);
						break;

					// Passive command

					case FTPCommand.Pasv:
						procPassive(ftpReq);
						break;

					// Restart position command

					case FTPCommand.Rest:
						procRestart(ftpReq);
						break;

					// Return file command

					case FTPCommand.Retr:
						procReturnFile(ftpReq);

						// Reset the restart position

						m_restartPos = 0;
						break;

					// Store file command

					case FTPCommand.Stor:
						procStoreFile(ftpReq, false);
						break;

					// Append file command

					case FTPCommand.Appe:
						procStoreFile(ftpReq, true);
						break;

					// Print working directory command

					case FTPCommand.Pwd:
					case FTPCommand.XPwd:
						procPrintWorkDir(ftpReq);
						break;

					// Change working directory command

					case FTPCommand.Cwd:
					case FTPCommand.XCwd:
						procChangeWorkDir(ftpReq);
						break;

					// Change to previous directory command

					case FTPCommand.Cdup:
					case FTPCommand.XCup:
						procCdup(ftpReq);
						break;

					// Full directory listing command

					case FTPCommand.List:
						procList(ftpReq);
						break;

					// Short directory listing command

					case FTPCommand.Nlst:
						procNList(ftpReq);
						break;

					// Delete file command

					case FTPCommand.Dele:
						procDeleteFile(ftpReq);
						break;

					// Rename file from command

					case FTPCommand.Rnfr:
						procRenameFrom(ftpReq);
						break;

					// Rename file to comand

					case FTPCommand.Rnto:
						procRenameTo(ftpReq);
						break;

					// Create new directory command

					case FTPCommand.Mkd:
					case FTPCommand.XMkd:
						procCreateDirectory(ftpReq);
						break;

					// Delete directory command

					case FTPCommand.Rmd:
					case FTPCommand.XRmd:
						procRemoveDirectory(ftpReq);
						break;

					// Return file size command

					case FTPCommand.Size:
						procFileSize(ftpReq);
						break;

					// Set modify date/time command

					case FTPCommand.Mdtm:
						procModifyDateTime(ftpReq);
						break;

					// System status command

					case FTPCommand.Syst:
						procSystemStatus(ftpReq);
						break;

					// Server status command

					case FTPCommand.Stat:
						procServerStatus(ftpReq);
						break;

					// Help command

					case FTPCommand.Help:
						procHelp(ftpReq);
						break;

					// No-op command

					case FTPCommand.Noop:
						procNoop(ftpReq);
						break;

					// Abort command

					case FTPCommand.Abor:
						procAbort(ftpReq);
						break;

					// Server features command

					case FTPCommand.Feat:
						procFeatures(ftpReq);
						break;

					// Options command

					case FTPCommand.Opts:
						procOptions(ftpReq);
						break;

					// Machine listing, single folder

					case FTPCommand.MLst:
						procMachineListing(ftpReq);
						break;

					// Machine listing, folder contents

					case FTPCommand.MLsd:
						procMachineListingContents(ftpReq);
						break;

					// Site specific commands

					case FTPCommand.Site:
						procSite(ftpReq);
						break;

					// Structure command (obsolete)

					case FTPCommand.Stru:
						procStructure(ftpReq);
						break;

					// Mode command (obsolete)

					case FTPCommand.Mode:
						procMode(ftpReq);
						break;

					// Allocate command (obsolete)

					case FTPCommand.Allo:
						procAllocate(ftpReq);
						break;

					// Extended Port command

					case FTPCommand.EPrt:
						procExtendedPort(ftpReq);
						break;

					// Extended Passive command

					case FTPCommand.EPsv:
						procExtendedPassive(ftpReq);
						break;

					// SSL/TLS authentication

					case FTPCommand.Auth:
						procAuth(ftpReq);
						break;

					// Unknown/unimplemented command

					default:
						if ( ftpReq.isCommand() != FTPCommand.InvalidCmd)
							sendFTPResponse(502, "Command " + FTPCommand.getCommandName(ftpReq.isCommand()) + " not implemented");
						else
							sendFTPResponse(502, "Command not implemented");
						break;
				}

				// Commit/rollback a transaction that the filesystem driver may have stored in the
				// session
			} // end while state
		}
		catch (SocketException ex) {

		}
		catch (Exception ex) {
			
		}

		// Cleanup the session, make sure all resources are released

		closeSession();
	}
}
