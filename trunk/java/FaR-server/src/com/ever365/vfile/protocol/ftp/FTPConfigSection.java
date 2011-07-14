/*
 * Copyright (C) 2005-2010 Alfresco Software Limited.
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

/**
 * FTP Server Configuration Section Class
 *
 * @author gkspencer
 */
public class FTPConfigSection {

  // FTP server configuration section name
  
  public static final String SectionName = "FTP";

  //  Bind address and FTP server port. A port of -1 indicates do not start FTP server.
  
  private InetAddress m_ftpBindAddress;
  private int m_ftpPort = -1;
  
  //  Allow anonymous FTP access and anonymous FTP account name
  
  private boolean m_ftpAllowAnonymous;
  private String m_ftpAnonymousAccount;
  
  //  FTP root path, if not specified defaults to listing all shares as the root
  
  private String m_ftpRootPath;
  
  //  FTP data socket range
  
  private int m_ftpDataPortLow;
  private int m_ftpDataPortHigh;
  
  //  FTP authenticaor interface
  
  private FTPAuthenticator m_ftpAuthenticator;
  
   //  FTP server debug flags
  
  private int m_ftpDebug;
  
  // FTP character set
  
  private String m_ftpCharSet;
  
  // IPv6 enabled
  
  private boolean m_ipv6;
  
  /**
   * Return the FTP server bind address, may be null to indicate bind to all available addresses
   * 
   * @return InetAddress
   */
  public final InetAddress getFTPBindAddress() {
    return m_ftpBindAddress;
  }
  
  /**
   * Return the FTP server port to use for incoming connections
   * 
   * @return int
   */
  public final int getFTPPort() {
    return m_ftpPort;
  }

  /**
   * Return the FTP authenticator interface
   * 
   * @return FTPAuthenticator
   */
  public final FTPAuthenticator getFTPAuthenticator() {
    return m_ftpAuthenticator;
  }
  
  /**
   * Determine if anonymous FTP access is allowed
   * 
   * @return boolean
   */
  public final boolean allowAnonymousFTP() {
    return m_ftpAllowAnonymous;
  }
  
  /**
   * Return the anonymous FTP account name
   * 
   * @return String
   */
  public final String getAnonymousFTPAccount() {
    return m_ftpAnonymousAccount;
  }
  
  /**
   * Return the FTP debug flags
   * 
   * @return int
   */
  public final int getFTPDebug() {
    return m_ftpDebug;
  }
  
  /**
   * Check if an FTP root path has been configured
   * 
   * @return boolean
   */
  public final boolean hasFTPRootPath() {
    return m_ftpRootPath != null ? true : false;
  }

  /**
   * Return the FTP root path
   * 
   * @return String
   */
  public final String getFTPRootPath() {
    return m_ftpRootPath;
  }
  
  /**
   * Determine if a port range is set for FTP data sockets
   * 
   * @return boolean
   */
  public final boolean hasFTPDataPortRange() {
    if ( m_ftpDataPortLow > 0 && m_ftpDataPortHigh > 0)
      return true;
    return false;
  }
  
  /**
   * Return the FTP data socket range low value
   * 
   * @return int
   */
  public final int getFTPDataPortLow() {
    return m_ftpDataPortLow;
  }
  
  /**
   * Return the FTP data socket range high value
   * 
   * @return int
   */
  public final int getFTPDataPortHigh() {
    return m_ftpDataPortHigh;
  }
  
  /**
   * Return the FTP character set
   * 
   * @return String
   */
  public final String getFTPCharacterSet() {
    return m_ftpCharSet;
  }
  
  /**
   * Check if IPv6 support is enabled
   * 
   * @return boolean
   */
  public final boolean isIPv6Enabled() {
	  return m_ipv6;
  }
  
  /**
   * Set the FTP character set
   * 
   * @param charSet String
   */
  public final void setFTPCharacterSet( String charSet) {
    m_ftpCharSet = charSet;
  }
  
  /**
   * Set the FTP server bind address, may be null to indicate bind to all available addresses
   * 
   * @param addr InetAddress
   * @return int
   * @exception InvalidConfigurationException
   */
  public final void setFTPBindAddress(InetAddress addr) {
    m_ftpBindAddress = addr;
  }
  
  /**
   * Set the FTP server port to use for incoming connections, -1 indicates disable the FTP server
   * 
   * @param port int
   * @return int
   * @exception InvalidConfigurationException
   */
  public final void setFTPPort(int port) {
    m_ftpPort = port;
    
  }

  /**
   * Enable/disable anonymous FTP access
   * 
   * @param ena boolean
   * @return int
   * @exception InvalidConfigurationException
   */
  public final void setAllowAnonymousFTP(boolean ena)
  {
        m_ftpAllowAnonymous = ena;
  }
  
  /**
   * Set the anonymous FTP account name
   * 
   * @param acc String
   * @return int
   * @exception InvalidConfigurationException
   */
  public final void setAnonymousFTPAccount(String acc) {
    m_ftpAnonymousAccount = acc;
  }
  
  /**
   * Set the authenticator to be used to authenticate FTP users.
   *
   * @param authClass String
   * @param params ConfigElement
   * @return int
   * @exception InvalidConfigurationException
   */
  public final void setAuthenticator(FTPAuthenticator authenticator) {
	  m_ftpAuthenticator = authenticator;
  }
  }
