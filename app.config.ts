import type { ExpoConfig } from '@expo/config';

const semverToCode = (v: string) => {
    const [maj, min] = v.split('.').map(n => parseInt(n || '0', 10));
    return maj * 1000 + min;
};

export default ({ config }: { config: ExpoConfig }) => {
    const raw = process.env.APP_VERSION || process.env.GITHUB_REF_NAME || '0.0';
    const version = raw.replace(/^v/i, '');
    const code = process.env.ANDROID_VERSION_CODE
        ? parseInt(process.env.ANDROID_VERSION_CODE, 10)
        : semverToCode(version);

    const googleFile = process.env.GOOGLE_SERVICES_JSON || "./google-services.json";

    return {
        ...config,
        version: version,
        android: {
            ...config.android,
            versionCode: code,
            googleServicesFile: googleFile
        },
        ios:     { ...config.ios, buildNumber: version },
    };
};
