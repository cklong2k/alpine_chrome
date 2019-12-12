#!/bin/sh
chromium-browser --headless \
--disable-gpu \
--disable-software-rasterizer \
--disable-dev-shm-usage \
--no-sandbox \
--print-to-pdf=$2 \
--hide-scrollbars $1

pwd

chmod 775 $2