# deploy to PMTools DEV server - this assumes the deployment machine has SSH already
# set up for the deployment target host
TARGET_HOST=${1:-ustry1metu001cl.metnet.net}
TARGET_PATH=${1:-./admb}

ssh ${TARGET_HOST} "${TARGET_PATH}/bin/admbctrl restart"

