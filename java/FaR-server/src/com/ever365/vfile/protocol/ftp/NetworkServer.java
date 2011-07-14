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

import java.net.InetAddress;
import java.util.Vector;

/**
 * Network Server Base Class
 * 
 * <p>Base class for server implementations for different protocols.
 *
 * @author gkspencer
 */
public abstract class NetworkServer {

  //  Server shutdown thread timeout
  
  protected final static int SHUTDOWN_TIMEOUT = 60000;  // 1 minute
  
	//	Protocol name
	
	private String m_protoName;
	
	//	Server version
	
	private String m_version;
	

	//	Debug enabled flag and debug flags
	
	private boolean m_debug;
	private int m_debugFlags;
	
  //	List of addresses that the server is bound to

  private InetAddress[] m_ipAddr;

  //	Server shutdown flag and server active flag

  private boolean m_shutdown = false;
  private boolean m_active = false;

  //  Server enabled flag
  
  private boolean m_enabled;
  
	//	Server error exception details
	
	private Exception m_exception;
	
	//	Session listener list

	private Vector<SessionListener> m_sessListeners;

	/**
	 * Class constructor
	 * 
	 * @param proto String
	 * @param config ServerConfiguration
	 */
	public NetworkServer(String proto) {
		m_protoName = proto;
    
	}
	
  /**
   * Return the list of IP addresses that the server is bound to.
   *
   * @return InetAddress[]
   */
  public final InetAddress[] getServerAddresses() {
    return m_ipAddr;
  }


  /**
   * Determine if the server is active.
   *
   * @return boolean
   */
  public final boolean isActive() {
    return m_active;
  }

  /**
   * Determine if the server is enabled
   * 
   * @return boolean
   */
  public final boolean isEnabled() {
    return m_enabled;
  }
  
  /**
   * Return the server version string, in 'n.n.n' format
   *
   * @return String
   */

  public final String isVersion() {
    return m_version;
  }

	/**
	 * Check if there is a stored server exception
	 * 
	 * @return boolean
	 */
	public final boolean hasException() {
		return m_exception != null ? true : false;
	}

	/**
	 * Return the stored exception
	 * 
	 * @return Exception
	 */
	public final Exception getException() {
		return m_exception;
	}

	/**
	 * Clear the stored server exception
	 */
	public final void clearException() {
		m_exception = null;	
	}
	
	/**
	 * Return the server protocol name
	 * 
	 * @return String
	 */
	public final String getProtocolName() {
		return m_protoName;
	}

	/**
	 * Determine if debug output is enabled
	 * 
	 * @return boolean
	 */
	public final boolean hasDebug() {
		return m_debug;
	}

	/**
	 * Determine if the specified debug flag is enabled
	 * 
	 * @return boolean
	 */
	public final boolean hasDebugFlag(int flg) {
	  return ( m_debugFlags & flg) != 0 ? true : false;
	}
	
	/**
	 * Check if the shutdown flag is set
	 * 
	 * @return boolean
	 */	
	public final boolean hasShutdown() {
		return m_shutdown;
	}
	
	/**
	 * Set/clear the server active flag
	 * 
	 * @param active boolean
	 */
	protected void setActive(boolean active) {
		m_active = active;
	}

  /**
   * Set/clear the server enabled flag
   * 
   * @param ena boolean
   */
  protected void setEnabled(boolean ena) {
    m_enabled = ena;
  }

	/**
	 * Set the stored server exception
	 * 
	 * @param ex Exception
	 */
	protected final void setException(Exception ex) {
		m_exception = ex;
	}

	/**
	 * Set the addresses that the server is bound to
	 * 
	 * @param addrs InetAddress[]
	 */
	protected final void setServerAddresses(InetAddress[] addrs) {
		m_ipAddr = addrs;
	}
	
	/**
	 * Set the server version
	 * 
	 * @param ver String
	 */
	protected final void setVersion(String ver) {
		m_version = ver;
	}

	/**
	 * Enable/disable debug output for the server
	 * 
	 * @param dbg boolean
	 */
	protected final void setDebug(boolean dbg) {
		m_debug = dbg;	
	}

	/**
	 * Set the debug flags
	 * 
	 * @param flags int
	 */
	protected final void setDebugFlags(int flags) {
	  m_debugFlags = flags;
	  setDebug(flags == 0 ? false : true);
	}
	
	/**
	 * Set/clear the shutdown flag
	 * 
	 * @param ena boolean
	 */
	protected final void setShutdown(boolean ena) {
		m_shutdown = ena;
	}
	
	
	/**
	 * Add a new session listener to the network server.
	 *
	 * @param l SessionListener
	 */
	public final void addSessionListener(SessionListener l) {

		//  Check if the session listener list is allocated

		if (m_sessListeners == null)
			m_sessListeners = new Vector<SessionListener>();
		m_sessListeners.add(l);
	}

	/**
	 * Remove a session listener from the network server.
	 *
	 * @param l SessionListener
	 */
	public final void removeSessionListener(SessionListener l) {

		//  Check if the listener list is valid

		if (m_sessListeners == null)
			return;
		m_sessListeners.removeElement(l);
	}

	/**
	 * Start the network server
	 */
	public abstract void startServer();
	
	/**
	 * Shutdown the network server
	 * 
	 * @param immediate boolean
	 */
	public abstract void shutdownServer(boolean immediate);

	/**
	 * Trigger a closed session event to all registered session listeners.
	 *
	 * @param sess SrvSession
	 */
	protected final void fireSessionClosedEvent(SrvSession sess) {

		//  Check if there are any listeners

		if (m_sessListeners == null || m_sessListeners.size() == 0)
			return;

		//  Inform all registered listeners

		for (int i = 0; i < m_sessListeners.size(); i++) {

			//	Get the current session listener

			try {
				SessionListener sessListener = m_sessListeners.elementAt(i);
				sessListener.sessionClosed(sess);
			}
			catch (Exception ex) {
// TODO:				debugPrintln("Session listener error [closed]: " + ex.toString());
			}
		}
	}

	/**
	 * Trigger a new session event to all registered session listeners.
	 *
	 * @param sess SrvSession
	 */
	protected final void fireSessionLoggedOnEvent(SrvSession sess) {

		//  Check if there are any listeners

		if (m_sessListeners == null || m_sessListeners.size() == 0)
			return;

		//  Inform all registered listeners

		for (int i = 0; i < m_sessListeners.size(); i++) {

			//	Get the current session listener

			try {
				SessionListener sessListener = m_sessListeners.elementAt(i);
				sessListener.sessionLoggedOn(sess);
			}
			catch (Exception ex) {
// TODO:				debugPrintln("Session listener error [logon]: " + ex.toString());
			}
		}
	}

	/**
	 * Trigger a new session event to all registered session listeners.
	 *
	 * @param sess SrvSession
	 */
	protected final void fireSessionOpenEvent(SrvSession sess) {

		//  Check if there are any listeners

		if (m_sessListeners == null || m_sessListeners.size() == 0)
			return;

		//  Inform all registered listeners

		for (int i = 0; i < m_sessListeners.size(); i++) {

			//	Get the current session listener

			try {
				SessionListener sessListener = m_sessListeners.elementAt(i);
				sessListener.sessionCreated(sess);
			}
			catch (Exception ex) {
// TODO:				debugPrintln("Session listener error [open]: " + ex.toString());
			}
		}
	}
}
