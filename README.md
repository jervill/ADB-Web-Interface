Prerequisites:
* Ruby
* sinatra (http://www.sinatrarb.com/)

![Screenshot](https://www.evernote.com/shard/s136/sh/8b296eed-998c-4868-9282-b013b857c643/d79404d00807c45294caee2ee074c3cc/res/daa728e1-c8fb-4c80-bf62-0e857a69520e)

This project is an easily configurable point and click web based interface for your most commonly used ADB commands. I made this because I got tired of typing in / copy pasting ADB commands into the command line over and over, and as an exercise to learn AJAX. It uses sinatra to start a local web server and run your ADB commands. Since I was learning AJAX, I avoided using javascript libraries for this first version.

Basically, commands are inserted into back ticks and run by Ruby. The page is generated based on a JSON file. I made this specifically for ADB commands, but it can easily be configured to run any command line command. Commands can be configured in the public/settings.json file.

Description of the json file below:
![Screenshot](https://www.evernote.com/shard/s136/sh/8bf1b218-7756-4d51-9d33-5188dfbd6a22/0c10ef58f4e8c0ce591985dfe9d5c20a/res/a10d0bb8-6edf-4f95-975e-dcfc900410aa)

To use, configure your public/settings.json, run adb_web_interface.rb, then navigate to http//127.0.0.1:4567/.

*Feature Roadmap:*
* Flashier graphics using JQuery.
* Support for multiple devices.
* Support for more input forms (instead of just the one hard coded install_form)
* Support for downloading and installing apks from a URL.
* GUI for configuring the json file.