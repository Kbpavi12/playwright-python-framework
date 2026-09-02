Python Playwright tests

Setup

1. Create and activate a virtual environment (optional but recommended):

```bash
python -m venv .venv
source .venv/bin/activate    # macOS / Linux
.venv\Scripts\Activate.ps1  # Windows PowerShell
```

2. Install dependencies:

```bash
pip install -r requirements.txt
python -m playwright install
```

3. Run the test:

```bash
pytest python_framework/tests/test_open_w3schools.py -q
```

Jenkins / CI

1. Add the provided `Jenkinsfile` to repository root.
2. Ensure the Jenkins agent has Python 3.8+ and access to install browsers. The pipeline creates a virtualenv and installs dependencies.
3. The Jenkinsfile runs `python -m playwright install chromium` — on Linux agents you may need additional system packages. See Playwright docs for your OS.
4. You can also call the provided runner scripts from a pipeline or agent directly:

Unix:
```bash
python_framework/run_tests.sh
```

Windows (PowerShell):
```powershell
.\python_framework\run_tests.ps1 -Headed:$false
```

Artifacts
- Screenshots and generated reports are saved under `python_framework/screenshots/` and `python_framework/` and archived by the pipeline.

