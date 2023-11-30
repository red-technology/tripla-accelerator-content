import * as tm from '@red-technology/tripla-models';
import { defineMigration, Context } from '@red-technology/tripla-api';

export default defineMigration(async (context: Context): Promise<void> => {
  const app = { repositories: { models: context.api.repositories.models(context), documents: context.api.repositories.documents(context) } };

  app.repositories.documents.patch({
    modelid: 'channel',
    id: 'tripla',
    host: 'localhost:2010',
  });
});
