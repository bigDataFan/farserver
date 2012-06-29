<%@page import="java.io.FileReader"%>
<%@page import="java.io.Reader"%>
<%@page import="com.google.appengine.api.files.AppEngineFile"%>
<%@page import="com.google.appengine.api.files.FileServiceFactory"%>
<%@page import="com.google.appengine.api.files.FileService"%>
<%@page import="com.google.appengine.api.blobstore.BlobKey"%>
<%@page import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>
<%@page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

FileService fileService = FileServiceFactory.getFileService();
%>    
<html>
<head>


<title>Insert title here</title>
</head>
<body>
aaa

<%
BlobKey blobKey = new BlobKey(request.getParameter("key"));

blobstoreService.serve(blobKey, response);
%>
</body>
</html>