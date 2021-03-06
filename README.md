# Bissol Table Data Editor

> **WARNING**: Do not use in production! This project is in its early stages. Functionality has only been tested with PostgreSQL and MariaDB/MySQL.

> **NOTE**: **AFTER INSTALLING THE PLUGIN YOU MUST RESTART THE BISERVER** so that the Kettle plugins get registered.

## Screenshots

Admin page to configure tables which should be made available for editing:

![](notes/img/btde-admin-page.png)

Main page which allows standard end users to edit the data (add, update and delete records) of a specific table:

![](notes/img/btde-main-page.png)

## Intended Purpose of the Plugin ##

The **Bissol Table Data Editor** (BTDE) Pentaho BI Server Plugin allows you to **update** and **add** data to **small database tables** via an easy-to-use web-interface.

Example **Use Cases**:

- Maintaining attribute fields in **dimension tables**. For some dimensions in a star schema you might ask end-users to add some additional information which is otherwise not available.
- Maintaining custom **configuration tables**
- Maintaining custom **metadata tables**

> **Note**: The **emphasis** is on maintaining **small tables**. The definition of **small** is anything that fits on a standard screen, so ideally less than a hundred records. As a safety measure, the BTDE limits the amount of data which can be displayed to 500 records.

## Additional Requirements for Installation ##

### BI / BA Server ###

This plugin will only work on biserver v5.2. with the latest version of the C*Tools installed.
Make sure you have at last one **data source** defined with a user which has **read and write** rights on the specific database.

### Kettle (PDI) Plugins ###

Currently **Sparkl** does't automatically include dependent PDI plugins. I have implemented a workaround so that these Kettle plugins get automatically installed on the first startup, after which you have to restart the biserver.

Following **Kettle** plugins will be automatically added to the `pentaho-solutions/system/kettle/plugins/steps` folder.

- [BA Server Utils](https://github.com/webdetails/kettle-baserver-utils)
- [JDBC Metadata](https://github.com/rpbouman/pentaho-pdi-plugin-jdbc-metadata/wiki/Installation)

### JDBC Driver

The respective JDBC drivers have to be installed in `tomcat/lib`. This should already be the case if you defined **data sources** on the Pentaho BA Server.

## Current Limitations ##


- Only current web browsers are supported. The main editor page makes use of the *contenteditable* attribute which is only supported by recent web browsers.
- Only one columns is supported for the **primary key**. The primary key has to be defined for the update logic. Note that the primary key has to be properly defined with auto increment on the database side for this to work. New: Also non auto-incremented primary keys are supported.
- If there is a DB error while adding, updating or removing records, only a generic error is shown in the web UI. This has to do with the fact that currently PDI DB steps do not feed back any DB error message details. A Jira case has been created for this feature to be implemented.

## General Workflow

Once the plugin is installed a user of the role admin can select tables via the **Admin** page and choose which columns of a DB table can be viewed and edited. Only then a standard end user can edit the data of a specific table via the **Main** page.

## Configuration

Administrators can enter the config information for each table via a dedicated **Admin** page in the **Pentaho User Console**. There is full support for adding, editing and deleting configuration entries. The configuration entries are stored in the `bissolTableDataEditorConfig.json` file on the server in following directory:

`pentaho-solutions/system/bissolTableDataEditorConfig`

### Different Editor Modes

The latest version supports two editor modes: **simple** and **complex**.

The **simple editor** supports inline table date editing. However, it doesn't support any of the following options:

- pagination
- search
- validation
- input helpers (date picker etc)

### Validation

Validation is only support in the **complex editor**. In the configuration you have to specify values for the `inputTye`, `validationPattern` and `validationMessage`.

The `validationPattern` is accepts a **regular expression** like e.g. `^[a-zA-Z]{1,35}$`. Please test your regular expression beforehand.

> Note: Fields of type date, datetime and time get validated automatically in complex editor mode, so do not specify any `validationPattern` for them. 

### Editable Primary Key

If for some reason you did not define an auto-incremented primary key for your table, you can define the primary key with the Bissol Editor as editable. This option is only available with the complex editor mode.

### How the configuration is saved to JSON

The structure of the JSON object looks like this:

```json
[
    {
    "configId": "76618e1a-d23b-4ae6-830e-601d509ec4e7"
  , "dbConnection": "psqllocaltest"
  , "dbSchema": "public"
  , "dbTable": "employees"
  , "editorType": "complex"
  , "metadata": [
      {
        "colIndex": "1"
      , "colName": "employee_id"
      , "colTypeDb": "serial"
      , "colType": "Integer"
      , "isVisible": true
      , "isEditable": false
      , "isPrimaryKey": true
      , "isAutoIncrement": true
      , "defaultValue": ""
      , "isRequired": true
      , "validationPattern": ""
      , "validationMessage": ""
      , "inputType": "none"
      , "colFormat": ""
      }
    , {
        "colIndex": "2"
      , "colName": "firstname"
      , "colTypeDb": "varchar"
      , "colType": "String"
      , "isVisible": true
      , "isEditable": true
      , "isPrimaryKey": false
      , "isAutoIncrement": false
      , "defaultValue": "Frank"
      , "isRequired": true
      , "validationPattern": "^[a-zA-Z]{1,35}$"
      , "validationMessage": "Has to be a string"
      , "inputType": "text"
      , "colFormat": ""
      }
    , {
        "colIndex": "3"
      , "colName": "lastname"
      , "colTypeDb": "varchar"
      , "colType": "String"
      , "isVisible": true
      , "isEditable": true
      , "isPrimaryKey": false
      , "isAutoIncrement": false
      , "defaultValue": ""
      , "isRequired": false
      , "validationPattern": ""
      , "validationMessage": ""
      , "inputType": "none"
      , "colFormat": ""
      }
    , {
        "colIndex": "4"
      , "colName": "start_date"
      , "colTypeDb": "date"
      , "colType": "Date"
      , "isVisible": true
      , "isEditable": true
      , "isPrimaryKey": false
      , "isAutoIncrement": false
      , "defaultValue": ""
      , "isRequired": true
      , "validationPattern": ""
      , "validationMessage": ""
      , "inputType": "date"
      , "colFormat": "yyyy-MM-dd"
      }
    , {
        "colIndex": "5"
      , "colName": "last_checkin"
      , "colTypeDb": "timestamp"
      , "colType": "Date"
      , "isVisible": true
      , "isEditable": true
      , "isPrimaryKey": false
      , "isAutoIncrement": false
      , "defaultValue": ""
      , "isRequired": false
      , "validationPattern": ""
      , "validationMessage": ""
      , "inputType": "datetime"
      , "colFormat": "yyyy-MM-dd HH:mm:ss"
      }
    , {
        "colIndex": "6"
      , "colName": "daily_break_time"
      , "colTypeDb": "time"
      , "colType": "Date"
      , "isVisible": true
      , "isEditable": true
      , "isPrimaryKey": false
      , "isAutoIncrement": false
      , "defaultValue": ""
      , "isRequired": false
      , "validationPattern": ""
      , "validationMessage": ""
      , "inputType": "time"
      , "colFormat": "HH:mm:ss"
      }
    ]
  }
]
```

The file structure is pretty self-explanatory, hence I assume that you will find it easy to amend it. You should not have to edit this file manually.

### Explicit labeling of column config entries

If you **edit** a configuration entry (configuration for one table) the columns will be listed on the **Admin page**. Columns details that are already stored in the configuration file are labelled **Configured** whereas other ones are labelled **New**. This is especially useful when the table definition changes on the database side.

### CDA Data Source

Currently you can only use a CDA data source to populate a select (drop down) menu. 