BrWebHost
====

Web IoT Controller for Broadlink Devices.

## Description

This is Web Remote-Controller for Broadlink Devices on your LAN.  
It Learning any IR Remote Controls for Rm, Switch Operating for SP3, and Displaying Sensor values for A1.  
Others include Wake on LAN, Script Executer, Remote-Script Runner.    
Touch operation like a smartphone-app has been realized.  

## Supported Platform
* Windows7, Windows8.1, Windows10 (**only x64 platform**)  
* Any Linux on x64
* RaspberryPi (**Raspbian November 2018 or later**)
  

## Usage for Windows
1. [Download Zip-Arvhive.](https://github.com/ume05rw/BrWebHost/releases/download/release1.0.1/SetupBrWebHost.zip)  
2. Unzip archived-files. 
3. Run 'setup.exe', to Install your system.
4. Run 'Start BrWebHost' on your Desktop Shoptcut and little wait, it wake up Browser.

Broadlink-Device Initializer is a Initial Setup Tool for Broadlink-Devices.  
It find your new Broadlink-Device on your LAN, and add Wi-Fi settings.  
This is only for Windows.  
  
[ScriptAgent](https://github.com/ume05rw/BrWebHost/releases/download/release1.0.1/SetupScriptAgent.zip) is tiny implementation that limits to Script Execution Only.  
It makes BrWebHost Remote-Scripting more convenient.  
  

## Usage for Linux
1. [Download Zip-Arvhive for your platform.](https://github.com/ume05rw/BrWebHost/releases)  
2. Unzip archived-files to your Install Folder, ex) /var/brwebhost/  
3. Set your Firewall, Open TCP/UDP 5004 ports.


Start on Command-Line.
     
     # /var/brwebhost/BrWebHost
     

If Start on Systemd, add 'brwebhost.service' to /etc/systemd/system/, like:

    
    [Unit]
    Description=Broadlink Device Controller

    [Service]
    ExecStart=/var/brwebhost/BrWebHost
    WorkingDirectory=/var/brwebhost/
    Restart=alway
    RestartSet=10
    SyslogIdentifier=brwebhost
    KillSignal=SIGINT
    User=root
    Environment=ASPNETCORE_ENVIRONMENT=Production

    [Install]
    WantedBy=multi-user.target
    
enabling service:

     
    # sudo systemctl enable brwebhost 
     

starting service:

     
    # sudo systemctl start brwebhost
     

and Access **localhost:5004** from your browser.  


## Licence

[MIT Licence](https://github.com/ume05rw/BrWebHost/blob/master/LICENSE)

## Author

[Do-Be's](http://dobes.jp)
