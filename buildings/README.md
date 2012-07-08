socialbim / buildings
=====================

The mapping component of the platform, used to spatially locate buildings and associated resources.

Debug command:
suite-sdk debug -g http://localhost:8080/geoserver /opt/opengeo/suite/webapps/socialbim/buildings

Deploy command:
suite-sdk deploy -d localhost -r 8080 -u manager -p XXXXXX -c jetty6x /opt/opengeo/suite/webapps/socialbim/buildings

Note: 
On Mac OSX, not only do you have to configure the realm.properties for Jetty as described in http://suite.opengeo.org/opengeo-docs/usermanual/tutorials/remotedeploy.html
but an extra component is needed to remote deploy using the client SDK => the Cargo deployer avialable at http://docs.codehaus.org/display/CARGO/Downloads
Solution based on thread: http://old.nabble.com/Re%3A-Re%3A-jetty-and-cargo-jetty-deployer-problem-p30163424.html



