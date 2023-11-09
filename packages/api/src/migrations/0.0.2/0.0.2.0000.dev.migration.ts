import * as tm from '@red-technology/tripla-models';
import { defineMigration, Context } from '@red-technology/tripla-api';

export default defineMigration(async (context: Context): Promise<void> => {
  const app = { repositories: { models: context.api.repositories.models(context), documents: context.api.repositories.documents(context) } };

  //Create a new model
  const m: tm.Model = new tm.Model('my-model', 'My Model', 'Description of my model to be displayed in the admin', 'my-app/sub-section/00000', 'mdi-cog', {
    properties: {
      string: new tm.StringProperty('string', 'Example string property', { default: 'a', enum: ['a', 'b', 'c'] }),
    },
    required: [],
    additionalProperties: false,
  });

  console.log('CUSTOM MIGRATION');

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

  //Add the model
  app.repositories.models.upsert(m);
});
