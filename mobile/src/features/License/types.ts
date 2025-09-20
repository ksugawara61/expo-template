export interface LicenseInfo {
  name: string;
  version: string;
  license: string | string[];
  repository?: string;
  publisher?: string;
  email?: string;
  url?: string;
  licenseFile?: string;
  noticeFile?: string;
}
