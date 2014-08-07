# Bissol Table Data Editor

## Intended Purpose of the Plugin ##

The **Bissol Table Data Editor** (BTDE) Pentaho BI Server Plugin allows you to **update** and **add** data to **small database tables** via an easy-to-use web-interface.

Example **Use Cases**:

- Maintaining attribute fields in **dimension tables**. For some dimensions in a star schema you might ask end-users to add some additional information which is otherwise not available.
- Maintaining custom **configuration tables**  
- Maintaining custom **metadata tables**

> **Note**: The **emphasis** is on maintaining **small tables**. The definition of **small** is anything that fits on a standard screen, so ideally less than a hundred records. As a safety measure, the BTDE limits the amount of data which can be displayed to 500 records.

## Additional Requirements for Installation ##

### Kettle (PDI) Plugins ###

Currently **Sparkl** does't automatically include dependent PDI plugins. 

Following **Kettle** plugins have to be installed manually into the `pentaho-solutions/system/kettle/plugins/steps` folder. Make sure you get the very latest versions of these plugins:

- BA Server Utils
- JDBC Metadata

### JDBC Driver

The respective JDBC driver have to be installed in `tomcat/lib`. This should already be the case if you defined **data sources** on the Pentaho BA Server.

## Current Limitations ##


- Only current web browsers are supported. The main editor page makes use of the *contenteditable* attribute which is only supported by recent web browsers.
- The **Configuration** page only supports adding new table properties **FOR ONE TABLE ONLY**. This is a major limitation and will be fixed as soon as possible. Currently you also cannot edit the configuration nor delete configuration entries.
- Only one columns is supported for the **primary key**. The primary key has to be defined for the update logic.
- **Configuration** details (stored as **Json** file) are stored within the **plugin** directory. The reason for this is that the **Json** file can be easily accessed via the **API** using **JavaScript**. This is not ideal as in case of an update of the plugin itself this file might get overridden. 

## Configuration

Administrators can enter the config information for each table via a dedicated **Admin** page in the **Pentaho User Console**. Currently, there is no support for updating this configuration via this interface, but admins can directly manipulate the file on the server in following directory:

`pentaho-solutions/system/bissolTableDataEditor/static/custom/config`

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

The file structure is pretty self-explanatory, hence I assume that you will find it easy to amend it.
