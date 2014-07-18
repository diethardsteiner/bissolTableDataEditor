#!/bin/sh

## -- BUSINESS INTELLIGENCE ENVIRONMENT CONFIG :: START -- ##

# ENVIRONMENT: possible values dev, test, prod
export PROJECT_ENVIRONMENT=dev

# PROJECT
export PROJECT_HOME=/home/dsteiner/Dropbox/projects/bissolTableDataEditor

# PENTAHO KETTLE
export PENTAHO_JAVA_HOME=/usr/java/jre1.7.0_45
export KETTLE_JNDI_ROOT=$PROJECT_HOME/config/$PROJECT_ENVIRONMENT/simple-jndi
export KETTLE_HOME=$PROJECT_HOME/config/$PROJECT_ENVIRONMENT
export PENTAHO_DI_JAVA_OPTIONS=" -Xmx1024m"
export PDI_ROOT_DIR=/home/dsteiner/apps/pentaho/pdi-ce-5.0.1-stable

#SPARKL
export SPARKL_PLUGIN_ROOT=/home/dsteiner/apps/pentaho/biserver/biserver-ce/pentaho-solutions/system/bissolTableDataEditor
alias syncsparkl=`cp -fR $SPARKL_PLUGIN_ROOT/* $PROJECT_HOME/pentaho-solutions/system/bissolTableDataEditor`

# PENTAHO REPORT DESIGNER
#ln -sf $PROJECT_HOME/config/$PROJECT_ENVIRONMENT/simple-jndi/jdbc.properties $HOME/.pentaho/simple-jndi/default.properties

# PENTAHO METADATA EDITOR
#ln -sf $PROJECT_HOME/config/$PROJECT_ENVIRONMENT/simple-jndi/jdbc.properties /opt/pentaho/pme/pme-ce-4.8.0-stable/simple-jndi

# SQLWORKBENCH
#export SQLWORKBENCH_CONFIG_DIR=$PROJECT_HOME/../../sql/sqlworkbench
#export JDBC_DRIVER_DIR=$PROJECT_HOME/../../sql/jdbc-drivers

# PSQL BULK LOADER REQUIRES UTF8 LOCALE
#export LANG=en_US.UTF-8

## -- BUSINESS INTELLIGENCE ENVIRONMENT CONFIG :: END -- ##
