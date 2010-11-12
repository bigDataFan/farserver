var result = new Object();


if (params.cmd=="open") {
	if (params.tree=="true") {
		result.tree = new Object();
		result.tree.name = "Home";
		result.tree.read = true;
		result.tree.write = true;
		result.tree.dirs = new Array();
		result.tree.dirs.push({
            "name": "Homex",
            "hash": "316c0925240a4647cc706541e6794dc3",
            "mime": "directory",
            "date": "11 Mar 2010 06:39",
            "size": 0,
            "read": true,
            "write": false,
            "rm": false
        });
		
	}
}

result.params = new Object();
result.params.uplMaxSize = "10M";
result.params.archives = [
                          "application/x-tar",
                          "application/x-gzip",
                          "application/x-bzip2",
                          "application/x-7z-compressed",
                          "application/zip"
                      ];
result.params.extract = result.params.archives;
result.params.url = "/service/upload";


result.cwd = {
    "hash": "e9f8bf5d915a834ee06ac784b906ce51",
    "name": "Home",
    "mime": "directory",
    "rel": "Home",
    "size": 0,
    "date": "11 Mar 2010 06:39",
    "read": true,
    "write": true,
    "rm": true
};


result.cdc = [
        {
            "name": "Homex",
            "hash": "316c0925240a4647cc706541e6794dc3",
            "mime": "directory",
            "date": "11 Mar 2010 06:39",
            "size": 0,
            "read": true,
            "write": false,
            "rm": false
        }
        ];

result.debug = {
    "time": 0.671977997,
    "mimeDetect": "mime_content_type",
    "imgLib": "gd",
    "dirSize": true,
    "du": true
};

result;