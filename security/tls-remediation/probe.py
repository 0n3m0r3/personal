import socket
import ssl

targets = [
    ("dv-g3b-emudhra.we-have-a-problem.com", False),
    ("dv-g3b-aaa-emudhra.we-have-a-problem.com", False),
    ("api.openai.com", True),
    ("api.telegram.org", True),
    ("accounts.google.com", True),
]
contexts = [("system", ssl.create_default_context())]
try:
    import certifi
except ImportError:
    pass
else:
    contexts.append(("certifi", ssl.create_default_context(cafile=certifi.where())))
for name, context in contexts:
    for host, allowed in targets:
        try:
            with socket.create_connection((host, 443), timeout=10) as raw:
                with context.wrap_socket(raw, server_hostname=host):
                    assert allowed, f"{name}: compromised chain accepted: {host}"
        except ssl.SSLCertVerificationError:
            assert not allowed, f"{name}: legitimate certificate rejected: {host}"
        print(name, host, "PASS")
