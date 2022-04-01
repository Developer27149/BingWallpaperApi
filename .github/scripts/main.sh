# stop bing server
pm2 stop bing
# install dependencies and restart server
nohup yarn && yarn start > /dev/null 2 > log &