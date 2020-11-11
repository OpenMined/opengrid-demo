const firebase = require("@firebase/rules-unit-testing");
const fs = require("fs");
const path = require("path");
const http = require("http");

/**
 * The emulator will accept any project ID for testing.
 */
const PROJECT_ID = "firestore-emulator-example";

/**
 * The FIRESTORE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec"
 */
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;

const RULES_FILE_PATH = path.join(path.dirname(__dirname), 'firestore.rules');

/**
 * Creates a new client FirebaseApp with authentication and returns the Firestore instance.
 */
function getAuthedFirestore(auth) {
    return firebase
        .initializeTestApp({projectId: PROJECT_ID, auth})
        .firestore();
}

beforeEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({projectId: PROJECT_ID});
});

before(async () => {
    // Load the rules file before the tests begin
    const rules = fs.readFileSync(RULES_FILE_PATH, "utf8");
    await firebase.loadFirestoreRules({projectId: PROJECT_ID, rules});
});

after(async () => {
    // Delete all the FirebaseApp instances created during testing
    // Note: this does not affect or clear any data
    await Promise.all(firebase.apps().map((app) => app.delete()));

    // Write the coverage report to a file
    const coverageFile = path.join(path.dirname(__dirname), 'firestore-coverage.html');
    const fstream = fs.createWriteStream(coverageFile);
    await new Promise((resolve, reject) => {
        http.get(COVERAGE_URL, (res) => {
            res.pipe(fstream, {end: true});

            res.on("end", resolve);
            res.on("error", reject);
        });
    });

    console.log(`View firestore rule coverage information at ${coverageFile}\n`);
});

describe("Opengrid firestore rules", () => {

    /**
     Sample:
     People cannot upvote more than once
     A dataset or model owner cannot upvote their own dataset or model, nor can they change the upvote field at all
     A person can only append their UID to the upvotes field, but they cannot set the value of the field to whatever they want (like setting it an empty array or setting it to an array with 1,000,000 rows)
     [v] People cannot update a dataset or model that they are not the author of
     People cannot delete a dataset or a model that they are not the author of
     People cannot edit another user
     [v] You can only create a dataset or model if you�re logged in
     People cannot store any data anywhere else in the main bucket, they can only upload a profile picture for themselves

     additional:
     - user can create dataset, model, or user only under theirs uid
     - owner cannot tamper with dataset or model created or updated date (during create or update)

     **/
    for (let table of ['datasets', 'models']) {

        it(`require users to log in before creating a ${table}`, async () => {
            const db = getAuthedFirestore(null);
            await firebase.assertFails(db.collection(table).doc("test").set({
                name: "test name",
                description: "test desc"
            }));
        });

        it(`should not allow updating other user's ${table}`, async () => {
            const alice = getAuthedFirestore('alice');
            const bob = getAuthedFirestore('bob');
            await firebase.assertSucceeds(alice.collection(table).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
            await firebase.assertFails(bob.collection(table).doc("alicecol").set({
                name: "No this is Bob's",
            }));
        });

    }

});
