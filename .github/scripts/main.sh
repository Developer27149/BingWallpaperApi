# stop bing server
pm2 stop bing
# pull repo data
git pull -f
# install dependencies and restart server
yarn && yarn start