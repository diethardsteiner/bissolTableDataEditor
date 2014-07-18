# Bissol Table Data Editor

## Configuration

Administrators can enter the config information for each table via a dedicated config screen in the **Pentaho User Console**. Currently, there is no support for updating this configuration via this interface, but admins can directly maninpulate the file on the server in following directory:

FILE REFERENCE MISSING

### How the configuration is saved to JSON

The structure of the JSON object looks like this:

```json
[
  {
    "configId": "32s3a343as332sasf3",
    "dbconnection": "psqllocaltest",
    "dbschema": "test",
    "dbtable": "employees",
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
  },
  {
    "configId": "4352dsg4234dfwe423",
    "dbconnection": "psqllocaltest",
    "dbschema": "test",
    "dbtable": "pk_test",
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
        "colName": "name",
        "isVisible": true,
        "isEditable": true,
        "isPrimaryKey": false
      }
    ]
  }
]
```

To read out the required field, we use JSON Path. A good site for testing the path is [JSON Online Evaluator](http://ashphy.com/JSONPathOnlineEvaluator/). In example, the retrieve the value of the first configId we could use following path:

```
$.[:1].configId
```

Or if we wanted the names of all configured tables we could use this:

```
$.[*].dbtable
```


# Open points

## JSON to form

Make it easy to edit the config. Maybe make use of [jsonform](https://github.com/joshfire/jsonform).
