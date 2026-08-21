const STORAGE_KEY = "taskflow_device_fingerprint";

export function getDeviceFingerprint(): string {
    let fp = localStorage.getItem(STORAGE_KEY);
    if (!fp) {
        fp = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, fp);
    }
    return fp;
}
