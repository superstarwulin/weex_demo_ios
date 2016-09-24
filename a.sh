#!/bin/sh


which brew > /dev/null 2>&1
if [ $? -eq 0 ]; then
   echo "brew is installed"
else
	ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
fi

brew tap phinze/homebrew-cask && brew install brew-cask
brew tap caskroom/versions

which npm > /dev/null 2>&1
if [ $? -eq 0 ]; then
   echo "npm is installed"
else
	brew install npm
fi

which tnpm > /dev/null 2>&1
if [ $? -eq 0 ]; then
   echo "tnpm is installed"
else
	npm install -g --registry=http://registry.npm.alibaba-inc.com tnpm --force
fi


which gitbook > /dev/null 2>&1
if [ $? -eq 0 ]; then
   echo "gitbook is installed"
else
	npm install -g gitbook-cli
fi

if [[ "$1" == "ios" ]]; then
  echo "deploy ios tools\n"

  xcode-select  --install
  which pod > /dev/null 2>&1
  if [ $? -eq 0 ]; then
  	echo "请先删除所有pod相关版本以及插件"
  	sudo gem uninstall cocoapods
  	sudo gem uninstall cocoapods-deintegrate
  	sudo gem uninstall cocoapods-dependencies
  	sudo gem uninstall cocoapods-browser
  	sudo gem uninstall cocoapods-open
  	sudo gem uninstall cocoapods-podfile_info
  	sudo gem uninstall cocoapods-try
  	sudo gem uninstall cocoapods-watch
  	sudo gem uninstall cocoapods-clean
  	sudo gem uninstall cocoapods-packager
  	sudo gem uninstall cocoapods-timeconsuming
  	sudo gem uninstall cocoapods-multithread-installpod
  	sudo gem uninstall cocoapods-podtarget-optimize
  fi

  sudo gem sources -a https://ruby.taobao.org/
  sudo gem sources --remove https://rubygems.org/
  sudo gem update

  sudo gem install cocoapods -v 0.35
  # sudo gem install cocoapods-deintegrate -v 0.2.1
  # sudo gem install cocoapods-dependencies -v 0.4.1
  # sudo gem install cocoapods-open -v 0.0.4
  # sudo gem install cocoapods-watch -v 0.1.0
  # sudo gem install cocoapods-clean -v 0.0.1
  # sudo gem install cocoapods-timeconsuming
  # sudo gem install cocoapods-multithread-installpod
  # sudo gem install cocoapods-podtarget-optimize

elif [[ "$1" == "android" ]]; then
  echo "deploy android tools\n"

  brew cask install java
  brew cask install android-studio
  sudo brew cask install intellij-idea
elif [[  "$1" == "server"  ]]; then
  echo "deploy server tools\n"
  sudo brew cask install intellij-idea
else
  echo "请选择你需要安装的目标(ios, android, server)\n"
  exit
fi
