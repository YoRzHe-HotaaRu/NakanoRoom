import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.nakanoroom.app',
    appName: 'Nakano Room',
    webDir: 'out',
    server: {
        // Allow loading local files
        androidScheme: 'https'
    },
    android: {
        // Splash screen and status bar config
        backgroundColor: '#FFF5F8'
    }
};

export default config;
