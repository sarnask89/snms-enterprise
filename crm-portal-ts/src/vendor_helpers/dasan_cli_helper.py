import json
import re
import select
import sys
import time

try:
    import paramiko
except Exception as exc:  # pragma: no cover - runtime dependency
    print(json.dumps({
        "ok": False,
        "error": f"paramiko import failed: {exc}",
    }))
    sys.exit(1)


PROMPT_RE = re.compile(r"(?m)(?:^|\n)[^\n]*(?:>|#)\s*$")
PASSWORD_RE = re.compile(r"password", re.IGNORECASE)


def read_payload():
    raw = sys.stdin.read()
    if not raw:
        raise RuntimeError("Missing helper input payload")
    return json.loads(raw)


def read_until(channel, timeout_seconds):
    deadline = time.time() + timeout_seconds
    chunks = []

    while time.time() < deadline:
        ready, _, _ = select.select([channel], [], [], 0.2)
        if ready and channel.recv_ready():
            data = channel.recv(65535).decode("utf-8", errors="ignore")
            chunks.append(data)
            joined = "".join(chunks)
            if PROMPT_RE.search(joined):
                return joined
            if PASSWORD_RE.search(joined):
                return joined
        else:
            time.sleep(0.05)

    return "".join(chunks)


def send_command(channel, command, timeout_seconds):
    channel.send(command + "\n")
    return read_until(channel, timeout_seconds)


def clean_command_output(raw_output, command):
    output = raw_output.replace("\r", "")
    lines = output.split("\n")
    cleaned = []
    command_seen = False

    for line in lines:
        stripped = line.strip()
        if not command_seen and stripped == command:
            command_seen = True
            continue
        cleaned.append(line)

    while cleaned and not cleaned[-1].strip():
        cleaned.pop()

    if cleaned and PROMPT_RE.search(cleaned[-1]):
        cleaned.pop()

    return "\n".join(cleaned).strip("\n")


def main():
    payload = read_payload()
    timeout_seconds = max(float(payload.get("timeoutMs", 15000)) / 1000.0, 1.0)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        client.connect(
            hostname=payload["host"],
            port=int(payload.get("port", 22)),
            username=payload["username"],
            password=payload["password"],
            look_for_keys=False,
            allow_agent=False,
            timeout=timeout_seconds,
            banner_timeout=timeout_seconds,
            auth_timeout=timeout_seconds,
        )

        channel = client.invoke_shell(width=200, height=1000)
        read_until(channel, timeout_seconds)

        enable_output = send_command(channel, "enable", timeout_seconds)
        if PASSWORD_RE.search(enable_output):
            channel.send(str(payload.get("enablePassword") or payload["password"]) + "\n")
            read_until(channel, timeout_seconds)

        outputs = []
        for command in payload.get("commands", []):
            raw_output = send_command(channel, command, timeout_seconds)
            outputs.append({
                "command": command,
                "output": clean_command_output(raw_output, command),
            })

        print(json.dumps({
            "ok": True,
            "outputs": outputs,
        }))
    except Exception as exc:
        print(json.dumps({
            "ok": False,
            "error": str(exc),
        }))
        sys.exit(1)
    finally:
        client.close()


if __name__ == "__main__":
    main()
