var file;
if (params.w) {
	file = content.getThumbnail(params.id, parseInt(params.w));
} else {
	file = content.get(params.id);
}

file;