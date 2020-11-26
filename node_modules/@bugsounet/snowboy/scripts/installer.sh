#!/bin/bash

Installer_yesno () {
  while true; do
    echo -e "\033[96m[@bugsounet/snowboy] Do you want to execute electron rebuild ? [Y/n]\033[0m"
    read -n 1 -p "$(echo -e "\033[96mYour choice: \033[0m")"
    echo
    [[ $REPLY =~ [Yy] ]] && electron-rebuild && break || break
    [[ $REPLY =~ [Nn] ]] && break
  done
}

prompt=true
if [ -e ../../../no-prompt ]; then
  prompt=false
fi

node-pre-gyp clean configure install --build-from-source 2>/dev/null

echo

if $prompt; then
  Installer_yesno
else
  electron-rebuild
fi
