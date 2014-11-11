var config =
	{
		"configId": "32s3a343as332sasf3",
		"dbConnection": "psqllocaltest",
		"dbSchema": "public",
		"dbTable": "employees",
		"metadata": [
			{
				"colIndex": 0,
				"colType": "Integer",
				"colName": "id",
				"isVisible": true,
				"isEditable": false,
				"isPrimaryKey": true
			},
			{
				"colIndex": 1,
				"colType": "String",
				"colName": "firstname",
				"isVisible": true,
				"isEditable": true,
				"isPrimaryKey": false
			},
			{
				"colIndex": 2,
				"colType": "String",
				"colName": "lastname",
				"isVisible": true,
				"isEditable": true,
				"isPrimaryKey": false
			}
		]
	}
;

//console.log(config.configId);
var idColumn = '';
config.metadata.forEach(function(elt, i) {
	console.log(elt.colName);
	if(elt.isPrimaryKey) idColumn = elt.colName;
});

console.log(idColumn);