"""The image the VM runs (see docs/runbook.md): the Vite build, served as static files."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCKERFILE = ROOT / "Dockerfile"
NGINX_CONF = ROOT / "nginx.conf"
REPOSITORY_URL = "https://github.com/tdshaw2000/puzzle-trainer"


def _instructions():
    """(INSTRUCTION, arguments) pairs, with continuation lines joined and comments dropped."""
    text = re.sub(r"\\\n", " ", DOCKERFILE.read_text())
    pairs = []
    for line in text.splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            keyword, _, arguments = line.partition(" ")
            pairs.append((keyword.upper(), arguments.strip()))
    return pairs


def _stages():
    """The instructions of each build stage, in order."""
    stages = []
    for keyword, arguments in _instructions():
        if keyword == "FROM":
            stages.append([])
        stages[-1].append((keyword, arguments))
    return stages


def _copies(stage):
    return [arguments.split() for keyword, arguments in stage if keyword == "COPY"]


def test_the_build_stage_installs_the_locked_dependencies_and_builds_the_site():
    build = _stages()[0]
    runs = [arguments for keyword, arguments in build if keyword == "RUN"]
    assert "npm ci" in runs
    assert "npm run build" in runs
    assert runs.index("npm ci") < runs.index("npm run build")


def test_the_served_image_holds_only_the_built_site_not_node_or_the_source():
    stages = _stages()
    assert len(stages) == 2
    served = stages[-1]
    assert served[0][1].startswith("nginxinc/nginx-unprivileged:")
    copies = _copies(served)
    built = [copy for copy in copies if copy[0].startswith("--from=")]
    assert built == [["--from=build", "/app/dist/", "/usr/share/nginx/html/"]]


def test_the_build_copies_the_files_vite_serves_as_they_are():
    # public/ holds the skins and skin.js, which Vite copies into dist/ untouched.
    assert ["public", "public"] in _copies(_stages()[0])


def test_the_image_runs_as_a_non_root_user():
    served = _stages()[-1]
    users = [arguments for keyword, arguments in served if keyword == "USER"]
    assert users, "no USER instruction"
    user = users[-1].split(":")[0]
    assert user.isdigit() and int(user) != 0


def test_the_image_serves_the_site_and_a_health_check_on_port_8000():
    assert ("EXPOSE", "8000") in _instructions()
    assert ["nginx.conf", "/etc/nginx/conf.d/default.conf"] in _copies(_stages()[-1])
    conf = NGINX_CONF.read_text()
    assert re.search(r"^\s*listen 8000;$", conf, re.MULTILINE)
    assert re.search(r"^\s*location = /healthz \{$", conf, re.MULTILINE)


def test_the_image_checks_its_own_health():
    healthchecks = [arguments for keyword, arguments in _instructions() if keyword == "HEALTHCHECK"]
    assert len(healthchecks) == 1
    assert "http://127.0.0.1:8000/healthz" in healthchecks[0]


def test_the_image_names_its_source_repository():
    labels = " ".join(arguments for keyword, arguments in _instructions() if keyword == "LABEL")
    assert f"org.opencontainers.image.source={REPOSITORY_URL}" in labels


def test_the_image_carries_the_deploy_files_for_installing_on_the_vm():
    assert ["deploy", "/opt/puzzle-trainer/deploy"] in _copies(_stages()[-1])


def test_the_build_context_leaves_out_dependencies_builds_and_tests():
    patterns = (ROOT / ".dockerignore").read_text().split()
    for pattern in (".git", "node_modules", "dist", ".venv", "tests"):
        assert pattern in patterns, pattern


def test_the_image_describes_this_app_not_its_nginx_base():
    labels = " ".join(arguments for keyword, arguments in _instructions() if keyword == "LABEL")
    assert "org.opencontainers.image.description=" in labels
    assert "nginx" not in labels.split("org.opencontainers.image.description=")[1].lower()
