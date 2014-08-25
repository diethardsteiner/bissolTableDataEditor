# Manual install instructions

Install procedure when not installing directly from Pentaho Marketplace:

It doesn't matter if you have the biserver running or not.
Add the plugin folder to pentaho-solutions/system.
Start the biserver if it isn't running.
In PUC go to tools > sparkl and click the sparkl refresh button. You should now see bissolTableDataEditor listed in the Sparkl projects.
Restart the biserver now
Once the biserver is fully accessible, you should see the required Kettle plugins in pentaho-solutions/system/kettle/plugins/steps
In PUC go to Tools > BissolTableDataEditor and the plugin should be fully functional
Within the plugin page click on Admin and configure a table. Once you saved the config, a folder should be automatically created unde pentaho-solutions/system/bissolTableDataEditorConfig holding the config file.
In PUC click on the Main menu link and you should be able to select the table you just configured.
