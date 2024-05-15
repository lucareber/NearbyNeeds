import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'NearbyNeeds',
  webDir: 'www',
  android: { 
    allowMixedContent: true, 
  },
  server: { 
    cleartext: true,
  },
  plugins: {
    BackgroundRunner: {
      label: 'com.capacitor.background.check',
      src: 'runners/runner.js',
      event: 'checkIn',
      repeat: true,
      interval: 1,
      autoStart: true,
    },
  },
};

export default config;
