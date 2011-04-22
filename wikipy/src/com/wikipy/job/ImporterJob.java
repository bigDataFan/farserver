package com.wikipy.job;

import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;


public class ImporterJob implements Job {

	private JobDAO jobDAO;
	
	public void setJobDAO(JobDAO jobDAO) {
		this.jobDAO = jobDAO;
	}
	
	public void execute(JobExecutionContext jcontext) throws JobExecutionException {
		
		jobDAO = (JobDAO) jcontext.getMergedJobDataMap().get("jobDAO");
		
		Map<String, Object> jobDetail = jobDAO.fetchJob();
		
		if (jobDetail!=null) {
			
		}
		System.out.println("job executed");
	}

	
	
	private final Timer timer = new Timer();
	
	public void init() {
		timer.schedule(new TimerTask() {
			
			@Override
			public void run() {
				
				
			}
		},  2 *60 * 1000);
	}
	
	
}
