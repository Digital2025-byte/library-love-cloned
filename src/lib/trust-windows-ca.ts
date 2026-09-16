import tls from "node:tls";
import { execFileSync } from "node:child_process";

let applied = false;

/**
 * Node does not use the Windows certificate store. Corporate HTTPS inspection
 * then fails with `SELF_SIGNED_CERT_IN_CHAIN` while the browser still works.
 * Append Root + CA certs from the OS store to Node's built-in list.
 */
export function ensureWindowsSystemCa(): void {
  if (applied) return;
  applied = true;

  if (typeof process === "undefined" || process.platform !== "win32") return;

  try {
    const pems = readWindowsCaPems();
    if (pems.length === 0) return;

    const original = tls.createSecureContext;
    tls.createSecureContext = ((options?: tls.SecureContextOptions) => {
      if (!options?.ca) {
        return original.call(tls, {
          ...options,
          ca: [...tls.rootCertificates, ...pems],
        });
      }
      const existing = Array.isArray(options.ca) ? options.ca : [options.ca];
      return original.call(tls, {
        ...options,
        ca: [...existing, ...pems],
      });
    }) as typeof tls.createSecureContext;
  } catch (error) {
    console.warn("[tls] Could not load the Windows certificate store:", error);
  }
}

function readWindowsCaPems(): string[] {
  const script = `
$stores = @(
  'Cert:\\CurrentUser\\Root',
  'Cert:\\CurrentUser\\CA',
  'Cert:\\LocalMachine\\Root',
  'Cert:\\LocalMachine\\CA'
)
foreach ($path in $stores) {
  Get-ChildItem -Path $path -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.RawData) { [Convert]::ToBase64String($_.RawData) }
  }
}
`;

  const out = execFileSync(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { encoding: "utf8", timeout: 20_000, windowsHide: true },
  );

  return [
    ...new Set(
      out
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    ),
  ].map(derBase64ToPem);
}

function derBase64ToPem(der: string): string {
  const body = der.match(/.{1,64}/g)?.join("\n") ?? der;
  return `-----BEGIN CERTIFICATE-----\n${body}\n-----END CERTIFICATE-----`;
}
