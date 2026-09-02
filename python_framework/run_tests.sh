#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
python -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m playwright install --with-deps chromium
export HEADLESS=1
mkdir -p reports
pytest tests -q --junitxml=reports/junit.xml
