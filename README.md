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
  },
  {
    "configId": "4352dsg4234dfwe423",
    "dbConnection": "psqllocaltest",
    "dbSchema": "public",
    "dbTable": "pk_test",
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
$.[*].dbTable
```

# Dependencies

## Kettle Plugins
These **Kettle** plugins have to be installed manually into the `pentaho-solutions/system/kettle/plugins/steps` folder:

- BA Server Utils
- JDBC Metadata

## JDBC Driver

The respective JDBC driver have to be installed in `tomcat/lib`. This should already be the case if you defined **data sources** on the Pentaho BA Server.

# Open points

## JSON to form

Make it easy to edit the config. Maybe make use of [jsonform](https://github.com/joshfire/jsonform).

## OrientDB

CDE makes use of [OrientDB](http://www.orientechnologies.com/orientdb/) - is there any chance to use it for this project as well?

DB files are stored in `system/.orient`.

# Status / Task List

- [ ] worked last on fetchConfig.ktr - waiting for Kettle bug to be fixed

# Sparkl Jira Cases

[Endpoints for Kettle sub-transformation steps](http://jira.pentaho.com/browse/SPARKL-65)
[Endpoints for last transformation within job](http://jira.pentaho.com/browse/SPARKL-66)
[Automatically included dependend Kettle plugins](http://jira.pentaho.com/browse/SPARKL-67)
