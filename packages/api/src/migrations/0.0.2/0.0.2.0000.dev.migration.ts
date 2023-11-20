import * as tm from '@red-technology/tripla-models';
import { defineMigration, Context } from '@red-technology/tripla-api';

export default defineMigration(async (context: Context): Promise<void> => {
  const app = { repositories: { models: context.api.repositories.models(context), documents: context.api.repositories.documents(context) } };

  app.repositories.documents.upsert('channel', {
    modelid: 'channel',
    id: 'tripla',
    name: 'Tripla',
    host: 'localhost:2010',
    path: '/',
    brand: {
      modelid: 'brand',
      id: 'tripla',
    },
    theme: {
      modelid: 'theme',
      id: 'tripla',
    },
    head: {
      modelid: 'head',
      id: 'tripla',
    },
    locale: {
      modelid: 'locale',
      id: 'en_gb',
    },
    enable_cookie_consent: true,
    cookie_policy_configuration: {
      cookie_policy: {
        modelid: 'cookie-policy',
        id: '332f8266-cda8-4cdc-a75b-381ad06ce729',
      },
      default_category_state: true,
    },
  });
});
