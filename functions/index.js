const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

exports.onDatasetCreated = functions.firestore
  .document('datasets/{datasetId}')
  .onWrite((change, context) => {
    const dataset = change.after.exists ? change.after.data() : null;
    const index = client.initIndex('datasets');

    if (!dataset) return index.deleteObject(context.params.datasetId);

    dataset.objectID = context.params.datasetId;
    dataset._tags = dataset.tags;
    return index.saveObject(dataset);
  });

exports.onModelCreated = functions.firestore
  .document('models/{modelId}')
  .onWrite((change, context) => {
    const model = change.after.exists ? change.after.data() : null;
    const index = client.initIndex('models');

    if (!model) return index.deleteObject(context.params.modelId);

    model.objectID = context.params.modelId;
    model._tags = model.tags;
    return index.saveObject(model);
  });
