#!/bin/bash

# to see all gnome-terminal options run gnome-terminal --help-all

gnome-terminal --tab --title biserver --working-directory /home/dsteiner/apps/pentaho/biserver/biserver-ce-5.1.0 --tab --title sql --working-directory=/home/dsteiner/apps/sqlworkbench --tab --title pdi --working-directory /home/dsteiner/apps/pentaho/pdi/pdi-ce-5.1.0.0 --tab --title git --working-directory /home/dsteiner/projects/bissolTableDataEditor --tab --title netbeans --working-directory /home/dsteiner/apps/netbeans-8.0/bin --execute ./netbeans

#gnome-terminal --tab --title sql --working-directory=/home/dsteiner/apps/sqlworkbench --execute sh ./sqlworkbench.sh --tab --title=pdi --working-directory=/home/dsteiner/apps/pentaho/pdi/pdi-ce-5.1.0.0 --execute sh ./spoon.sh --tab --title=git --working-directory=/home/dsteiner/Dropbox/projects/bissolTableDataEditor --tab --title biserver --working-directory=/home/dsteiner/apps/pentaho/biserver/biserver-ce-5.1.0 --execute sh ./start-pentaho.sh
