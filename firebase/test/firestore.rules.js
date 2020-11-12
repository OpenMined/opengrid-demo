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

before(async function () {
    this.timeout(5000);
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
      ? People cannot upvote more than once
      ? A dataset or model owner cannot upvote their own dataset or model, nor can they change the upvote field at all
      ? A person can only append their UID to the upvotes field, but they cannot set the value of the field to whatever they want (like setting it an empty array or setting it to an array with 1,000,000 rows)
     [v] People cannot update a dataset or model that they are not the author of
     [v] People cannot delete a dataset or a model that they are not the author of
     [v] People cannot edit another user
     [v] You can only create a dataset or model if you're logged in
      - People cannot store any data anywhere else in the main bucket, they can only upload a profile picture for themselves

     additional:
     - [v] user can create dataset, model, or user only with theirs uid
     - [v] owner of dataset/model cannot update it to make it other user's dataset/model
     - [v] owner cannot tamper with dataset or model created or updated date (during create or update)

     **/

    ['datasets', 'models'].forEach(collection => {
        it(`require users to log in before creating a ${collection}`, async () => {
            const db = getAuthedFirestore(null);
            await firebase.assertFails(db.collection(collection).doc("test").set({
                name: "test name",
                description: "test desc"
            }));
        });

        it(`should not allow updating or deleting other user's ${collection}`, async () => {
            const alice = getAuthedFirestore({uid: 'alice'});
            const bob = getAuthedFirestore({uid: 'bob'});
            await firebase.assertSucceeds(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
            await firebase.assertFails(bob.collection(collection).doc("alicecol").update({
                name: "No this is Bob's",
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
            await firebase.assertFails(bob.collection(collection).doc("alicecol").delete());
        });

        it(`should not allow creating ${collection} under other user's uid`, async () => {
            const alice = getAuthedFirestore({uid: 'alice'});
            await firebase.assertSucceeds(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
            await firebase.assertFails(alice.collection(collection).doc("bobcol").set({
                name: "Bob's stuff",
                author: "bob",
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
        });

        it(`should not allow owner updating ${collection} to have other user's uid`, async () => {
            const alice = getAuthedFirestore({uid: 'alice'});
            await firebase.assertSucceeds(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
            // update but don't touch author
            await firebase.assertSucceeds(alice.collection(collection).doc("alicecol").update({
                name: "Pretend to be Bob's stuff",
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
            // try to assign it to bob
            await firebase.assertFails(alice.collection(collection).doc("alicecol").update({
                name: "Bob's stuff",
                author: "bob",
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
        });

        it(`shouldn't allow creating ${collection} with arbitrary created/updated time`, async () => {
            const alice = getAuthedFirestore({uid: 'alice'});
            await firebase.assertFails(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                created_at: firebase.firestore.Timestamp.fromDate(new Date('2020-01-01')),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
            await firebase.assertFails(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.Timestamp.fromDate(new Date('2020-01-01')),
            }));
            await firebase.assertSucceeds(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
        });

        it(`shouldn't allow updating ${collection} with arbitrary created/updated time`, async () => {
            const alice = getAuthedFirestore({uid: 'alice'});
            await firebase.assertSucceeds(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));

            // can update to current ts
            await firebase.assertSucceeds(alice.collection(collection).doc("alicecol").update({
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));

            // can't update to arbitrary
            await firebase.assertFails(alice.collection(collection).doc("alicecol").update({
                updated_at: firebase.firestore.Timestamp.fromDate(new Date('2020-01-01')),
            }));

            // can't update created_at
            await firebase.assertFails(alice.collection(collection).doc("alicecol").update({
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));
            await firebase.assertFails(alice.collection(collection).doc("alicecol").update({
                created_at: firebase.firestore.Timestamp.fromDate(new Date('2020-01-01')),
            }));
        });

        it(`shouldn't allow user to vote for own ${collection}`, async () => {
            const alice = getAuthedFirestore({uid: 'alice'});

            // create with votes
            await firebase.assertFails(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                upvotes: ["alice"],
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));

            await firebase.assertSucceeds(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                upvotes: [],
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));

            // update upvotes
            await firebase.assertFails(alice.collection(collection).doc("alicecol").update({
                upvotes: firebase.firestore.FieldValue.arrayUnion("alice"),
            }));
            await firebase.assertFails(alice.collection(collection).doc("alicecol").update({
                upvotes: [],
            }));
        });

        it(`shouldn't allow user to vote for ${collection} on others behalf`, async () => {
            const alice = getAuthedFirestore({uid: 'alice'});
            const bob = getAuthedFirestore({uid: 'bob'});
            const john = getAuthedFirestore({uid: 'john'});

            await firebase.assertSucceeds(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                upvotes: [],
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));

            // vote for theirselves
            await firebase.assertSucceeds(bob.collection(collection).doc("alicecol").update({
                upvotes: firebase.firestore.FieldValue.arrayUnion("bob"),
            }));

            // vote for others
            await firebase.assertFails(bob.collection(collection).doc("alicecol").update({
                upvotes: firebase.firestore.FieldValue.arrayUnion("john"),
            }));

            // vote for others
            await firebase.assertFails(john.collection(collection).doc("alicecol").update({
                upvotes: firebase.firestore.FieldValue.arrayRemove("bob"),
            }));

            // just try to remove everything
            await firebase.assertFails(john.collection(collection).doc("alicecol").update({
                upvotes: [],
            }));
        });

        it(`shouldn't allow user to vote multiple times on ${collection}`, async () => {
            const alice = getAuthedFirestore({uid: 'alice'});
            const bob = getAuthedFirestore({uid: 'bob'});

            await firebase.assertSucceeds(alice.collection(collection).doc("alicecol").set({
                name: "Alice's stuff",
                author: "alice",
                upvotes: [],
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            }));

            // vote for theirselves
            await firebase.assertSucceeds(bob.collection(collection).doc("alicecol").update({
                upvotes: firebase.firestore.FieldValue.arrayUnion("bob"),
            }));

            // vote again
            await firebase.assertFails(bob.collection(collection).doc("alicecol").update({
                upvotes: firebase.firestore.FieldValue.arrayUnion("bob"),
            }));
        });

    });

    it(`require users to log in before creating a user`, async () => {
        const db = getAuthedFirestore(null);
        await firebase.assertFails(db.collection("users").doc("test").set({
            contact_email: "test@example.net",
        }));
    });

    it(`should not allow creating users under other user's uid`, async () => {
        const alice = getAuthedFirestore({uid: 'alice'});
        await firebase.assertSucceeds(alice.collection("users").doc("alice").set({
            contact_email: "alice@openmined.org",
        }));
        await firebase.assertFails(alice.collection("users").doc("bob").set({
            contact_email: "bob@openmined.org",
        }));
    });

    it(`should not allow modifying other users`, async () => {
        const alice = getAuthedFirestore({uid: 'alice'});
        const bob = getAuthedFirestore({uid: 'bob'});

        // create
        await firebase.assertSucceeds(alice.collection("users").doc("alice").set({
            contact_email: "alice@openmined.org",
        }));
        await firebase.assertSucceeds(bob.collection("users").doc("bob").set({
            contact_email: "bob@openmined.org",
        }));

        // update
        await firebase.assertSucceeds(alice.collection("users").doc("alice").update({
            contact_email: "alice+new@openmined.org",
        }));
        await firebase.assertFails(alice.collection("users").doc("bob").update({
            contact_email: "alice+bob@openmined.org",
        }));

        // delete
        await firebase.assertFails(alice.collection("users").doc("bob").delete());
    });

});
