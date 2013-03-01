#!/usr/bin/env python

#Installs sublime text on Ubuntu 12.04
#installation includes 
#	*an option to download the tar.bz2 file
#	*creation of sublime.default file
#	*fake sublime default text editor
#
#Author Ivan Dominic Bagui <baguio.ivan@gmail.com>
#
import sys, subprocess, urllib2, os, fileinput

file_name=None

def downloadSublime():
	global file_name
	url = "http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%202.0.1%20x64.tar.bz2"

	file_name = "~/Downloads/"+url.split('/')[-1]
	u = urllib2.urlopen(url)
	f = open(file_name, 'wb')
	meta = u.info()
	file_size = int(meta.getheaders("Content-Length")[0])
	print "Downloading: %s Bytes: %s" % (file_name, file_size)

	file_size_dl = 0
	block_sz = 8192
	while True:
	    buffer = u.read(block_sz)
	    if not buffer:
		break

	    file_size_dl += len(buffer)
	    f.write(buffer)
	    status = r"%10d  [%3.2f%%]" % (file_size_dl, file_size_dl * 100. / file_size)
	    status = status + chr(8)*(len(status)+1)
	    print status,
	f.close()


#edit the defaults list and set sublime as default text editor
#replaces gedit only
def setSublimeAsDefault():
	print "Making Sublime Text 2 as default text editor"
	def_ = "/usr/share/applications/defaults.list"

	#if gedit is in line, replace it with sublime
	def updatedLine(line):
		line.replace("gedit", "sublime")

	for line in fileinput.input(def_, inplace=1):
		print "%s" % (updatedLine(line)),

#main installation stuff
#filename - filename (file location) of tar.bz2 file
def installSublime(filename):
	print "Now installing Sublime Text 2..."
	#desktop entry for sublime
	sublime_desktop = """[Desktop Entry]
Version=1.0
Name=Sublime Text 2
# Only KDE 4 seems to use GenericName, so we reuse the KDE strings.
# From Ubuntu's language-pack-kde-XX-base packages, version 9.04-20090413.
GenericName=Text Editor

Exec=sublime
Terminal=false
Icon=/opt/Sublime Text 2/Icon/48x48/sublime_text.png
Type=Application
Categories=TextEditor;IDE;Development
X-Ayatana-Desktop-Shortcuts=NewWindow

[NewWindow Shortcut Group]
Name=New Window
Exec=sublime -n
TargetEnvironment=Unity"""

	print "Decompressing file"
	subprocess.call(["tar", "xf",filename])
	print "Moving directory to /opt"
	subprocess.call(["sudo","mv","Sublime Text 2","/opt/"])
	print "Creating symbolic link"
	subprocess.call(["sudo","ln","-s","/opt/Sublime Text 2/sublime_text","/usr/bin/sublime"])
	print "Creating Desktop entry"
	
	desk = open("sublime.desktop",'w')
	desk.write(sublime_desktop)
	desk.close()

	subprocess.call(["sudo","mv","sublime.desktop","/usr/share/applications/sublime.desktop"])
	setSublimeAsDefault()
	print "Everything is done!"
def main():
	try:
		filename = sys.argv[1]
	except:
		print "File location of Sublime Text tar.bz2 not found"
		while (True):
			i = raw_input("Would you like to download? (y/n)")
			if i == 'n': 
				print "Please specify file location of Sublime Text tar.bz2 file"
				sys.exit(0)
			else:
				downloadSublime()
				installSublime(file_name)

	installSublime(filename)

if __name__ == "__main__":
	if not os.geteuid()==0:
		print "Please run this script as root"
		sys.exit(0)
	main()
