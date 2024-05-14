import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'mobilegi_2024',
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
      interval: 30,
      autoStart: true,
    },
  },
};

export default config;
