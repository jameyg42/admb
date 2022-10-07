# deploy to PMTools DEV server - this assumes the deployment machine has SSH already
# set up for the deployment target host
TARGET_HOST=${1:-ustry1metu001cl.metnet.net}
TARGET_PATH=${1:-./admb}

ssh ${TARGET_HOST} "rm -fr ${TARGET_PATH}/bin ${TARGET_PATH}/dist ${TARGET_PATH}/out"
#ssh ${TARGET_HOST} "cd ${TARGET_PATH} && . ~/.nvm/nvm.sh && nvm use 10 && npm install appdynamics@21.5.0"
scp -r ./out/ ${TARGET_HOST}:${TARGET_PATH}
scp -r ./dist/ ${TARGET_HOST}:${TARGET_PATH}
scp -r ./bin/ ${TARGET_HOST}:${TARGET_PATH}
ssh ${TARGET_HOST} "chmod 755 ${TARGET_PATH}/bin/admbctrl"
ssh ${TARGET_HOST} "${TARGET_PATH}/bin/admbctrl restart"

