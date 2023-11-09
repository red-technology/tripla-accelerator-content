import { Model } from '@red-technology/tripla-models';
import { defineFeature } from "@red-technology/tripla-api";

/**
 * Define a custom feature
 */
export default defineFeature(
  "custom",
  "Custom Example Feature",
  "mdi-cog",
  "An Example feature that does nothing.",
  {
    global: false,
    getManageTabs: async (context, data) => [],
    isEnabled: (model) => true,
    modelConfiguration: {
      properties: {},
      required: [],
      additionalProperties: false
    },
    propertyConfiguration: {
      properties: {},
      required: [],
      additionalProperties: false
    },
    setup: async (context) => {},
    hooks: {
      onDocumentPostAdd: async (context, data) => {},
      onDocumentPostDelete: async (context, data) => {},
      onDocumentPostExists: async (context, data) => {},
      onDocumentPostFilter: async (context, data) => {},
      onDocumentPostFilterAll: async (context, data) => {},
      onDocumentPostFirst: async (context, data) => {},
      onDocumentPostGet: async (context, data) => {},
      onDocumentPostList: async (context, data) => {},
      onDocumentPostListAll: async (context, data) => {},
      onDocumentPostListPaged: async (context, data) => {},
      onDocumentPostManage: async (context, data) => {},
      onDocumentPostTruncate: async (context, data) => {},
      onDocumentPostUpdate: async (context, data) => {},
      onDocumentPostUpsert: async (context, data) => {},
      onDocumentPostValidate: async (context, data) => {},
      onDocumentPreAdd: async (context, data) => {},
      onDocumentPreDelete: async (context, data) => {},
      onDocumentPreExists: async (context, data) => {},
      onDocumentPreFilter: async (context, data) => {},
      onDocumentPreFilterAll: async (context, data) => {},
      onDocumentPreFirst: async (context, data) => {},
      onDocumentPreGet: async (context, data) => {},
      onDocumentPreList: async (context, data) => {},
      onDocumentPreListAll: async (context, data) => {},
      onDocumentPreListPaged: async (context, data) => {},
      onDocumentPreManage: async (context, data) => {},
      onDocumentPreTruncate: async (context, data) => {},
      onDocumentPreUpdate: async (context, data) => {},
      onDocumentPreUpsert: async (context, data) => {},
      onDocumentPreValidate: async (context, data) => {},
      onModelPostAdd: async (context, data) => {},
      onModelPostDelete: async (context, data) => {},
      onModelPostUpdate: async (context, data) => {},
      onModelPostUpsert: async (context, data) => {},
      onModelPreAdd: async (context, data) => {},
      onModelPreUpdate: async (context, data) => {},
      onModelPreUpsert: async (context, data) => {},
    },
  }
);
