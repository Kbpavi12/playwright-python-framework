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

Scheduling in Jenkins

1. To schedule a run at 3:45 PM (server time) using Jenkins Pipeline, create a new Pipeline job and point it to `Jenkinsfile.scheduled` in repository root.
2. The schedule in `Jenkinsfile.scheduled` uses `cron('45 15 * * *')` — this will run daily at 15:45. If you need a single run, create the job, let it run once, then disable or remove the trigger.
3. To manually trigger the job from Jenkins UI: open the job page and click "Build Now" (or use the Actions/Run button in Blue Ocean). You can also trigger via API:

```bash
curl -X POST "http://<JENKINS_HOST>/job/<JOB_NAME>/build" --user "<USER>:<API_TOKEN>"
```

4. If your Jenkins agent runs on Linux, ensure necessary system packages for Playwright are installed. See Playwright docs: https://playwright.dev/docs/ci

5. After the job runs, artifacts (screenshots, reports) are archived by the pipeline and visible in the job's build artifacts.

Triggering on git push (webhook)

1. Use a Pipeline or Multibranch Pipeline job pointing at this repository (the job reads `Jenkinsfile` from the repo root).
2. Configure your Git provider webhook to notify Jenkins on push events:
	- GitHub (classic): add a webhook with `Payload URL` set to `http://<JENKINS_HOST>/github-webhook/` and content type `application/json`.
	- GitHub (use GitHub Branch Source plugin / GitHub App): install the GitHub App or use the GitHub Branch Source and configure credentials in Jenkins; webhooks are created automatically.
	- GitLab/Bitbucket: use the repository service webhook URL for Jenkins (e.g. `http://<JENKINS_HOST>/project/<JOB_NAME>` for Git plugin) or install the corresponding SCM plugin.

3. Jenkins job configuration:
	- For a single-branch Pipeline job: enable the option `GitHub hook trigger for GITScm polling` (requires GitHub plugin) or enable `Build when a change is pushed to BitBucket/GitLab` depending on provider.
	- For Multibranch Pipeline: create a Multibranch Pipeline job and add your Git repository as a branch source — Jenkins will scan branches and build on webhook events automatically.

4. Test the webhook:
	- From GitHub UI: Webhooks -> `Send a ping`.
	- Or via curl (example):

```bash
curl -X POST "http://<JENKINS_HOST>/github-webhook/" -H "Content-Type: application/json" --data '{"ref":"refs/heads/main"}'
```

5. Verify in Jenkins: check the job's Build History or Blue Ocean 'Branches' view. Artifacts and junit results will be archived per the `Jenkinsfile`.

Notes
- Ensure Jenkins has network access to your Git host and the required plugins (Git, GitHub, GitHub Branch Source, Generic Webhook Trigger if needed). 
- If Playwright requires system packages (especially on Linux agents), either install them on the agent or use a Docker-based agent with the Playwright dependencies preinstalled. See https://playwright.dev/docs/ci for recommended containers and packages.



