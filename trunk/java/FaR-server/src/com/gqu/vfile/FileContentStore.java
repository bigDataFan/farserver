package com.gqu.vfile;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.GregorianCalendar;

import net.gqu.security.User;
import net.gqu.utils.GUID;


public class FileContentStore {
	
	private String storeUri;

	private File root;
	public void setStoreUri(String storeUri) {
		this.storeUri = storeUri;
		root = new File(storeUri);
	}
	
	

	public FileContentWriter getContentWriter() {
		File newFile;
		try {
			newFile = createNewFile(root, createNewFileStoreUrl());
			if (newFile==null) {
				throw new ContentException("File Not Created");
			}
			return new FileContentWriter(root, newFile);
		} catch (IOException e) {
			throw new ContentException("Error gen file writer");
		}
	}
	
	/**
	 * Creates a new content URL. This must be supported by all stores that are
	 * compatible with Alfresco.
	 * 
	 * @return Returns a new and unique content URL
	 */
	public static String createNewFileStoreUrl() {
		Calendar calendar = new GregorianCalendar();
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH) + 1; // 0-based
		int day = calendar.get(Calendar.DAY_OF_MONTH);
		int hour = calendar.get(Calendar.HOUR_OF_DAY);
		int minute = calendar.get(Calendar.MINUTE);
		// create the URL
		StringBuilder sb = new StringBuilder(20);
		sb.append(year).append('/').append(month).append('/').append(day)
				.append('/').append(hour).append('/').append(minute)
				.append('/').append(GUID.generate()).append(".bin");
		String newContentUrl = sb.toString();
		return newContentUrl;
	}

	
	/**
	 * Creates a file for the specifically provided content URL. The URL may not
	 * already be in use.
	 * <p>
	 * The store prefix is stripped off the URL and the rest of the URL used
	 * directly to create a file.
	 * @param root 
	 * 
	 * @param newContentUrl
	 *            the specific URL to use, which may not be in use
	 * @return Returns a new and unique file
	 * @throws IOException
	 *             if the file or parent directories couldn't be created or if
	 *             the URL is already in use.
	 * @throws UnsupportedOperationException
	 *             if the store is read-only
	 * 
	 * @see #setReadOnly(boolean)
	 */
	public File createNewFile(File root, String newContentUrl) throws IOException {

		File file = makeFile(root, newContentUrl);

		// create the directory, if it doesn't exist
		File dir = file.getParentFile();
		if (!dir.exists()) {
			makeDirectory(dir);
		}

		// create a new, empty file
		boolean created = file.createNewFile();
		if (!created) {
			return null;
		}

		// done
		return file;
	}
	
	
	/**
     * Synchronized and retrying directory creation.  Repeated attempts will be made to create the
     * directory, subject to a limit on the number of retries.
     * 
     * @param dir               the directory to create
     * @throws IOException      if an IO error occurs
     */
    private synchronized void makeDirectory(File dir) throws IOException
    {
        /*
         * Once in this method, the only contention will be from other file stores or processes.
         * This is OK as we have retrying to sort it out.
         */
        if (dir.exists())
        {
            // Beaten to it during synchronization
            return;
        }
        // 20 attempts with 20 ms wait each time
        for (int i = 0; i < 20; i++)
        {
            boolean created = dir.mkdirs();
            if (created)
            {
                // Successfully created
                return;
            }
            // Wait
            try { this.wait(20L); } catch (InterruptedException e) {}
            // Did it get created in the meantime
            if (dir.exists())
            {
                // Beaten to it while asleep
                return;
            }
        }
        // It still didn't succeed
        throw new ContentException("Failed to create directory for file storage: " +  dir);
    }
	

	/**
	 * Creates a file from the given relative URL.
	 * 
	 * @param contentUrl
	 *            the content URL including the protocol prefix
	 * @return Returns a file representing the URL - the file may or may not
	 *         exist
	 * @throws UnsupportedContentUrlException
	 *             if the URL is invalid and doesn't support the
	 *             {@link FileContentStore#STORE_PROTOCOL correct protocol}
	 * 
	 * @see #checkUrl(String)
	 */
	private File makeFile(File rootDirectory, String contentUrl) {
		File file = new File(rootDirectory, contentUrl);
		return file;
	}

	public FileContentReader getContentReader(String contentUrl, String encoding) {
		return new FileContentReader(new File(root, contentUrl), encoding);
	}
	
	public void remove(User owner, String contentUrl) {
		File targetFile = new File(root, contentUrl);
		try {
			targetFile.delete();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
