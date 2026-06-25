#!/usr/bin/env bash
# Runs a command with the stray ancestor Yarn PnP manifest moved aside so
# esbuild uses normal node_modules resolution. Always restores, even on
# failure / interrupt. Usage: .design-sync/no-pnp.sh <command...>
set -u
PNP=/home/tng/Work/.pnp.cjs
BAK="$PNP.dssync-bak"
restore() { [ -e "$BAK" ] && mv -f "$BAK" "$PNP"; }
trap restore EXIT INT TERM
[ -e "$PNP" ] && mv -f "$PNP" "$BAK"
"$@"
