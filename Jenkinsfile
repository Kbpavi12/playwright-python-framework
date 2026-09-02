pipeline {
  agent any
  options {
    ansiColor('xterm')
    timestamps()
  }
  environment {
    PYTHONPATH = "${WORKSPACE}/python_framework"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Setup') {
      steps {
        script {
          if (isUnix()) {
            sh '''#!/usr/bin/env bash
set -euo pipefail
cd python_framework
python -m venv .venv
. .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python -m playwright install --with-deps chromium
mkdir -p reports
'''
          } else {
            bat '''@echo off
cd python_framework
python -m venv .venv
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m playwright install chromium
if not exist reports mkdir reports
'''
          }
        }
      }
    }

    stage('Run tests') {
      steps {
        script {
          if (isUnix()) {
            sh '''#!/usr/bin/env bash
cd python_framework
. .venv/bin/activate
export HEADLESS=1
pytest tests -q --junitxml=reports/junit.xml || true
'''
          } else {
            bat '''@echo off
cd python_framework
set HEADLESS=1
.venv\Scripts\python -m pytest tests -q --junitxml=reports\junit.xml || exit /b 0
'''
          }
        }
      }
      post {
        always {
          junit 'python_framework/reports/junit.xml'
        }
      }
    }

    stage('Archive artifacts') {
      steps {
        archiveArtifacts artifacts: 'python_framework/screenshots/**, python_framework/*.docx, python_framework/*.html, python_framework/reports/**', fingerprint: true
      }
    }
  }
}
