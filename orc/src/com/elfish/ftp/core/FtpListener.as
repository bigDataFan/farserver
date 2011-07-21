package com.elfish.ftp.core
{
	import com.elfish.ftp.model.Response;
	import com.elfish.ftp.status.ResponseStatus;
	import com.elfish.ftp.worker.IWorker;

	public interface FtpListener
	{
		
		function tell(worker:IWorker, resp:Response):void;
		
	}
}