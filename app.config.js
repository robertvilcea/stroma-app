import 'dotenv/config';

export default {
  expo: {
    name: 'stroma-mvp',
    slug: 'stroma-mvp',
    version: '1.0.0',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },    
    android: {
      package: 'com.robertvilcea.stromamvp',
    },
    ios: {
      bundleIdentifier: 'com.robertvilcea.stromamvp',
    },
    extra: {
      tmdbApiKey: process.env.TMDB_API_KEY,
      eas: {
        projectId: 'ad499a02-c707-4ada-aeb5-e24c41d18211',
      },
    },
  },
};
