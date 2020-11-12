const firebase = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { beforeEach, before, after, describe } = require('mocha');

const PROJECT_ID = 'firestore-emulator-example';
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;
const RULES_FILE_PATH = path.join(path.dirname(__dirname), 'firestore.rules');

function getAuthedFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
}

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

before(async function () {
  this.timeout(5000);

  // Load the rules file before the tests begin
  const rules = fs.readFileSync(RULES_FILE_PATH, 'utf8');
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});

after(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(firebase.apps().map((app) => app.delete()));

  // Write the coverage report to a file
  const coverageFile = path.join(
    path.dirname(__dirname),
    'firestore-coverage.html'
  );

  const fstream = fs.createWriteStream(coverageFile);

  await new Promise((resolve, reject) => {
    http.get(COVERAGE_URL, (res) => {
      res.pipe(fstream, { end: true });

      res.on('end', resolve);
      res.on('error', reject);
    });
  });

  console.log(`View firestore rule coverage information at ${coverageFile}\n`);
});

describe('Opengrid firestore rules', () => {
  ['datasets', 'models'].forEach((collection) => {
    it(`should not allow unauthenticated users to create a ${collection}`, async () => {
      const db = getAuthedFirestore(null);

      await firebase.assertFails(
        db.collection(collection).doc('test').set({
          name: 'test name',
          description: 'test desc',
          upvotes: [],
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );
    });

    it(`should not allow updating or deleting other user's ${collection}`, async () => {
      const alice = getAuthedFirestore({ uid: 'alice' });
      const bob = getAuthedFirestore({ uid: 'bob' });

      await firebase.assertSucceeds(
        alice.collection(collection).doc('alicecol').set({
          name: "Alice's stuff",
          author: 'alice',
          upvotes: [],
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      await firebase.assertFails(
        bob.collection(collection).doc('alicecol').update({
          name: "No this is Bob's",
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      await firebase.assertFails(
        bob.collection(collection).doc('alicecol').delete()
      );
    });

    it(`should not allow creating ${collection} under other user's uid`, async () => {
      const alice = getAuthedFirestore({ uid: 'alice' });

      await firebase.assertSucceeds(
        alice.collection(collection).doc('alicecol').set({
          name: "Alice's stuff",
          author: 'alice',
          upvotes: [],
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      await firebase.assertFails(
        alice.collection(collection).doc('bobcol').set({
          name: "Bob's stuff",
          author: 'bob',
          upvotes: [],
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );
    });

    it(`should not allow owner updating ${collection} to have other user's uid`, async () => {
      const alice = getAuthedFirestore({ uid: 'alice' });

      await firebase.assertSucceeds(
        alice.collection(collection).doc('alicecol').set({
          name: "Alice's stuff",
          author: 'alice',
          upvotes: [],
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      // Update but don't touch author
      await firebase.assertSucceeds(
        alice.collection(collection).doc('alicecol').update({
          name: "Pretend to be Bob's stuff",
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      // Try to assign it to bob
      await firebase.assertFails(
        alice.collection(collection).doc('alicecol').update({
          name: "Bob's stuff",
          author: 'bob',
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );
    });

    it(`should not allow creating ${collection} with arbitrary created_at or updated_at time`, async () => {
      const alice = getAuthedFirestore({ uid: 'alice' });

      await firebase.assertFails(
        alice
          .collection(collection)
          .doc('alicecol')
          .set({
            name: "Alice's stuff",
            author: 'alice',
            upvotes: [],
            created_at: firebase.firestore.Timestamp.fromDate(
              new Date('2020-01-01')
            ),
            updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          })
      );

      await firebase.assertFails(
        alice
          .collection(collection)
          .doc('alicecol')
          .set({
            name: "Alice's stuff",
            author: 'alice',
            upvotes: [],
            created_at: firebase.firestore.FieldValue.serverTimestamp(),
            updated_at: firebase.firestore.Timestamp.fromDate(
              new Date('2020-01-01')
            ),
          })
      );
    });

    it(`should not allow updating ${collection} with arbitrary created_at or updated_at time`, async () => {
      const alice = getAuthedFirestore({ uid: 'alice' });

      await firebase.assertSucceeds(
        alice.collection(collection).doc('alicecol').set({
          name: "Alice's stuff",
          author: 'alice',
          upvotes: [],
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      // Can update updated_at to current ts
      await firebase.assertSucceeds(
        alice.collection(collection).doc('alicecol').update({
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      // Can't update updated_at to arbitrary
      await firebase.assertFails(
        alice
          .collection(collection)
          .doc('alicecol')
          .update({
            updated_at: firebase.firestore.Timestamp.fromDate(
              new Date('2020-01-01')
            ),
          })
      );

      // Can't update created_at
      await firebase.assertFails(
        alice.collection(collection).doc('alicecol').update({
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      // Can't update created_at to arbitrary
      await firebase.assertFails(
        alice
          .collection(collection)
          .doc('alicecol')
          .update({
            created_at: firebase.firestore.Timestamp.fromDate(
              new Date('2020-01-01')
            ),
          })
      );
    });

    it(`should not allow user to upvote their own ${collection}`, async () => {
      const alice = getAuthedFirestore({ uid: 'alice' });

      // Can't create with upvotes
      await firebase.assertFails(
        alice
          .collection(collection)
          .doc('alicecol')
          .set({
            name: "Alice's stuff",
            author: 'alice',
            upvotes: ['alice'],
            created_at: firebase.firestore.FieldValue.serverTimestamp(),
            updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          })
      );

      await firebase.assertSucceeds(
        alice.collection(collection).doc('alicecol').set({
          name: "Alice's stuff",
          author: 'alice',
          upvotes: [],
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      // Can't update upvotes if author
      await firebase.assertFails(
        alice
          .collection(collection)
          .doc('alicecol')
          .update({
            upvotes: firebase.firestore.FieldValue.arrayUnion('alice'),
          })
      );

      // Can't clear upvotes if author
      await firebase.assertFails(
        alice.collection(collection).doc('alicecol').update({
          upvotes: [],
        })
      );
    });

    it(`should not allow user to upvote for ${collection} on others behalf`, async () => {
      const alice = getAuthedFirestore({ uid: 'alice' });
      const bob = getAuthedFirestore({ uid: 'bob' });
      const john = getAuthedFirestore({ uid: 'john' });
      const karl = getAuthedFirestore({ uid: 'karl' });

      await firebase.assertSucceeds(
        alice.collection(collection).doc('alicecol').set({
          name: "Alice's stuff",
          author: 'alice',
          upvotes: [],
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      // Can upvote for themselves
      await firebase.assertSucceeds(
        bob
          .collection(collection)
          .doc('alicecol')
          .update({
            upvotes: firebase.firestore.FieldValue.arrayUnion('bob'),
          })
      );

      // Can upvote for themselves (again)
      await firebase.assertSucceeds(
        john
          .collection(collection)
          .doc('alicecol')
          .update({
            upvotes: firebase.firestore.FieldValue.arrayUnion('john'),
          })
      );

      // Can't vote for others
      await firebase.assertFails(
        bob
          .collection(collection)
          .doc('alicecol')
          .update({
            upvotes: firebase.firestore.FieldValue.arrayUnion('karl'),
          })
      );

      // Can't remove upvote for others
      await firebase.assertFails(
        karl
          .collection(collection)
          .doc('alicecol')
          .update({
            upvotes: firebase.firestore.FieldValue.arrayRemove('bob'),
          })
      );

      // Can remove upvote for themselves
      await firebase.assertSucceeds(
        john
          .collection(collection)
          .doc('alicecol')
          .update({
            upvotes: firebase.firestore.FieldValue.arrayRemove('john'),
          })
      );

      // Can't clear upvotes for others
      await firebase.assertFails(
        karl.collection(collection).doc('alicecol').update({
          upvotes: [],
        })
      );
    });

    it(`should not allow user to upvote multiple times on ${collection}`, async () => {
      const alice = getAuthedFirestore({ uid: 'alice' });
      const bob = getAuthedFirestore({ uid: 'bob' });

      await firebase.assertSucceeds(
        alice.collection(collection).doc('alicecol').set({
          name: "Alice's stuff",
          author: 'alice',
          upvotes: [],
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        })
      );

      // Can upvote for themselves (first time)
      await firebase.assertSucceeds(
        bob
          .collection(collection)
          .doc('alicecol')
          .update({
            upvotes: firebase.firestore.FieldValue.arrayUnion('bob'),
          })
      );

      // Can't upvote for themselves (second time)
      await firebase.assertFails(
        bob
          .collection(collection)
          .doc('alicecol')
          .update({
            upvotes: firebase.firestore.FieldValue.arrayUnion('bob'),
          })
      );
    });
  });

  it(`should not allow users to write to db before logging in`, async () => {
    const db = getAuthedFirestore(null);

    await firebase.assertFails(
      db.collection('users').doc('test').set({
        contact_email: 'test@example.net',
      })
    );
  });

  it(`should not allow creating users in db under other user's uid`, async () => {
    const alice = getAuthedFirestore({ uid: 'alice' });

    await firebase.assertSucceeds(
      alice.collection('users').doc('alice').set({
        contact_email: 'alice@openmined.org',
      })
    );

    await firebase.assertFails(
      alice.collection('users').doc('bob').set({
        contact_email: 'bob@openmined.org',
      })
    );
  });

  it(`should not allow modifying other users`, async () => {
    const alice = getAuthedFirestore({ uid: 'alice' });
    const bob = getAuthedFirestore({ uid: 'bob' });

    await firebase.assertSucceeds(
      alice.collection('users').doc('alice').set({
        contact_email: 'alice@openmined.org',
      })
    );

    await firebase.assertSucceeds(
      bob.collection('users').doc('bob').set({
        contact_email: 'bob@openmined.org',
      })
    );

    // Can update themselves
    await firebase.assertSucceeds(
      alice.collection('users').doc('alice').update({
        contact_email: 'alice+new@openmined.org',
      })
    );

    // Can't update others
    await firebase.assertFails(
      alice.collection('users').doc('bob').update({
        contact_email: 'alice+bob@openmined.org',
      })
    );

    // Can't delete others
    await firebase.assertFails(alice.collection('users').doc('bob').delete());
  });
});
