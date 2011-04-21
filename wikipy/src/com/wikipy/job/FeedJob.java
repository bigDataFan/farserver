package com.wikipy.job;

import java.util.Map;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class FeedJob implements Job {

	private JobDAO jobDAO;
	
	public void setJobDAO(JobDAO jobDAO) {
		this.jobDAO = jobDAO;
	}



	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		Map<String, Object> jobDetail = jobDAO.fetchJob();
		
		
		
	}

}
