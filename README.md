BrWebHost
====

Web IoT Controller for Broadlink Devices.

## Description

This is Web Remote-Controller for Broadlink Devices on your LAN.  
It Learning any IR Remote Controls for Rm, Switch Operating for SP3, and Displaying Sensor values for A1.  
Touch operation like a smartphone-app has been realized.  

## Supported Platform
* Windows7, Windows10 (only x64 platform)  
* Any Linux on x64
* RaspberryPi (Raspbian)
  

## Usage for Windows
1. [Download Zip-Arvhive for your platform.](https://github.com/ume05rw/BrWebHost/releases)  
2. Unzip archived-files. 
3. Run 'setup.exe', to Install your system.
4. Run 'Start BrWebHost' on your Desktop Shoptcut, to Inisialize and Start.


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
     

start service:

     
    # sudo systemctl start brwebhost
     


## Licence

[MIT Licence](https://github.com/ume05rw/BrWebHost/blob/master/LICENSE)

## Author

[Do-Be's](http://dobes.jp)
