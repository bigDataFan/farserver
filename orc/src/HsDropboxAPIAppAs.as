import flash.events.Event;
import flash.events.IOErrorEvent;
import flash.net.FileReference;
import flash.net.URLLoader;
import flash.net.URLRequest;
import flash.utils.ByteArray;

import mx.controls.Alert;

import org.hamster.dropbox.DropboxClient;
import org.hamster.dropbox.DropboxConfig;
import org.hamster.dropbox.DropboxEvent;
import org.hamster.dropbox.models.AccountInfo;
import org.hamster.dropbox.models.DropboxFile;

[Bindable] public var dropAPI:DropboxClient;

public function appCompleteHandler():void
{
	var config:DropboxConfig = new DropboxConfig('', '');
	//config.setRequestToken("qbydhghboi3xxzj", "3kp051vyokfi2hm");
	config.setConsumer("qbydhghboi3xxzj", "3kp051vyokfi2hm");
	//config.setConsumer();
	//      config.setRequestToken('', '');
	//config.setAccessToken('', '');
	dropAPI = new DropboxClient(config);
}

public function createAccount():void
{
	dropAPI.createAccount('yourtestemailhere@gmail.com', '123abc', 'a', 'b');
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.ACCOUNT_CREATE_RESULT, handler);
	}
	dropAPI.addEventListener(DropboxEvent.ACCOUNT_CREATE_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.ACCOUNT_CREATE_FAULT)) {
		dropAPI.addEventListener(DropboxEvent.ACCOUNT_CREATE_FAULT, faultHandler);
	}
}

public function getRequestToken():void
{
	dropAPI.requestToken();
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.REQUEST_TOKEN_RESULT, handler);
		var obj:Object = evt.resultObject;
		reqTokenKeyLabel.text = obj.key;
		reqTokenSecretLabel.text = obj.secret;
		// goto authorization web page to authorize, after that, call get access token 
		if (oauthRadioBtn.selected) {
			Alert.show(dropAPI.authorizationUrl);
		}
	};
	dropAPI.addEventListener(DropboxEvent.REQUEST_TOKEN_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.REQUEST_TOKEN_FAULT)) {
		dropAPI.addEventListener(DropboxEvent.REQUEST_TOKEN_FAULT, faultHandler);
	}
}

public function emailLogin():void
{
	dropAPI.token(eMailLabel.text, passwordLabel.text);
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.TOKEN_RESULT, handler);
		var obj:Object = evt.resultObject;
		accTokenKeyLabel.text = obj.token;
		accTokenSecretLabel.text = obj.secret;
		loginedAPIContainer.enabled = true;
	};
	dropAPI.addEventListener(DropboxEvent.TOKEN_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.TOKEN_FAULT)) {
		dropAPI.addEventListener(DropboxEvent.TOKEN_FAULT, faultHandler);
	}
}

public function getAccessToken():void
{
	dropAPI.accessToken();
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.ACCESS_TOKEN_RESULT, handler);
		var obj:Object = evt.resultObject;
		accTokenKeyLabel.text = obj.key;
		accTokenSecretLabel.text = obj.secret;
		loginedAPIContainer.enabled = true;
	};
	dropAPI.addEventListener(DropboxEvent.ACCESS_TOKEN_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.ACCESS_TOKEN_FAULT)) {
		dropAPI.addEventListener(DropboxEvent.ACCESS_TOKEN_FAULT, faultHandler);
	}
}

public function accountInfo():void
{
	dropAPI.accountInfo();
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.ACCESS_TOKEN_RESULT, handler);
		var accountInfo:AccountInfo = AccountInfo(evt.resultObject);
		accountInfoLabel.text = accountInfo.toString();
	};
	dropAPI.addEventListener(DropboxEvent.ACCOUNT_INFO_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.ACCOUNT_INFO_FAULT)) {
		//dropAPI.addEventListener(DropboxEvent.ACCOUNT_INFO_FAULT, faultHandler);
	}
}

private var testFolder1:String = new Date().time.toString() + "1";
private var testFile:String;

public function uploadFile():void
{
	var fr:FileReference = new FileReference();
	var loadCompHandler:Function = function (evt:Event):void
	{
		fr.removeEventListener(Event.COMPLETE, loadCompHandler);
		testFile = fr.name;
		dropAPI.putFile(testFolder1, fr.name, fr.data);
		var handler:Function = function (evt:DropboxEvent):void
		{
			dropAPI.removeEventListener(DropboxEvent.PUT_FILE_RESULT, handler);
			uploadFileLabel.text = evt.resultObject.toString();
		};
		dropAPI.addEventListener(DropboxEvent.PUT_FILE_RESULT, handler);
		if (!dropAPI.hasEventListener(DropboxEvent.PUT_FILE_FAULT)) {
			dropAPI.addEventListener(DropboxEvent.PUT_FILE_FAULT, faultHandler);
		}
	};
	var selectHandler:Function = function (evt:Event):void
	{
		fr.removeEventListener(Event.SELECT, selectHandler);
		fr.addEventListener(Event.COMPLETE, loadCompHandler);
		fr.load();
	};
	fr.addEventListener(Event.SELECT, selectHandler);
	fr.browse();
}

public function copyFile():void
{
	dropAPI.fileCopy(testFolder1 + '/' + testFile, testFolder1 + '/copied_' + testFile);
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.FILE_COPY_RESULT, handler);
		var dropboxFile:DropboxFile = DropboxFile(evt.resultObject);
		copyFileLabel.text = dropboxFile.toString();
	};
	dropAPI.addEventListener(DropboxEvent.FILE_COPY_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.FILE_COPY_FAULT)) {
		dropAPI.addEventListener(DropboxEvent.FILE_COPY_FAULT, faultHandler);
	}               
}

private var testFolder:String = new Date().time.toString();

public function createFolder():void
{
	dropAPI.fileCreateFolder(testFolder, 'dropbox');
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.FILE_CREATE_FOLDER_RESULT, handler);
		var dropboxFile:DropboxFile = DropboxFile(evt.resultObject);
		createFolderLabel.text = dropboxFile.toString();
	};
	dropAPI.addEventListener(DropboxEvent.FILE_CREATE_FOLDER_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.FILE_CREATE_FOLDER_FAULT)) {
		dropAPI.addEventListener(DropboxEvent.FILE_CREATE_FOLDER_FAULT, faultHandler);
	}       
}

public function moveFile():void
{
	dropAPI.fileMove(testFolder1 + '/' + testFile, testFolder1 + '/moved_' + testFile);
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.FILE_MOVE_RESULT, handler);
		var dropboxFile:DropboxFile = DropboxFile(evt.resultObject);
		moveFileLabel.text = dropboxFile.toString();
	};
	dropAPI.addEventListener(DropboxEvent.FILE_MOVE_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.FILE_MOVE_FAULT)) {
		dropAPI.addEventListener(DropboxEvent.FILE_MOVE_FAULT, faultHandler);
	}               
}

public function deleteFile():void
{
	dropAPI.fileDelete(testFolder1 + '/moved_' + testFile);
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.FILE_DELETE_RESULT, handler);
		deleteFileLabel.text = evt.resultObject.toString();
	};
	dropAPI.addEventListener(DropboxEvent.FILE_DELETE_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.FILE_DELETE_RESULT)) {
		dropAPI.addEventListener(DropboxEvent.FILE_DELETE_FAULT, faultHandler);
	}
}

public function getFile():void
{
	dropAPI.getFile('VCE_090522_A003.MP3');
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.GET_FILE_RESULT, handler);
		getFileLabel.text = ByteArray(evt.resultObject).length.toString();
	};
	dropAPI.addEventListener(DropboxEvent.GET_FILE_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.GET_FILE_FAULT)) {
		dropAPI.addEventListener(DropboxEvent.GET_FILE_FAULT, faultHandler);
	}       
}

public function metadata():void
{
	dropAPI.metadata('12744358208051' + '', 1000, "", true);
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.METADATA_RESULT, handler);
		metadataLabel.text = DropboxFile(evt.resultObject).toString();
	};
	dropAPI.addEventListener(DropboxEvent.METADATA_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.METADATA_FAULT)) {
		dropAPI.addEventListener(DropboxEvent.METADATA_FAULT, faultHandler);
	}       
}

public function thumbnails():void
{
	dropAPI.thumbnails('test.jpg', "");
	var handler:Function = function (evt:DropboxEvent):void
	{
		dropAPI.removeEventListener(DropboxEvent.THUMBNAILS_RESULT, handler);
		thumbnailsLabel.text = ByteArray(evt.resultObject).length.toString();
	};
	dropAPI.addEventListener(DropboxEvent.THUMBNAILS_RESULT, handler);
	if (!dropAPI.hasEventListener(DropboxEvent.THUMBNAILS_FAULT)) {
		dropAPI.addEventListener(DropboxEvent.THUMBNAILS_FAULT, faultHandler);
	}       
}

private function faultHandler(evt:Event):void
{
	Alert.show((evt as Object).resultObject);
}// ActionScript file