const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.addMessage = functions.https.onRequest(async(request, response) => {
//   const original = request.query.text;
//   const write = await admin.firestore().collection('messages')
//   .add({
//           originalData: original
//     }) 
//   functions.logger.info("Hello logs ! First request testing..", {structuredData: true});
//   //response.send(`Hello from Firebase!  ${write.id} added`);
//   response.json({ result: `Hello from Firebase!  ${write.id} added`});
// });

// exports.makeUpperCase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap, context) => {
//         const original = snap.data().originalData;
//         functions.logger.log('Uppercasing', context.params.documentId, original) //grabs param ID and logs
//         const upperCase = original.toUpperCase();
//         return snap.ref.set({ upperCase }, { merge: true });
//     })

exports.myMessages = functions.firestore.document('/messages/{documentId}')
.onCreate((snap, context) => {
    const newVal = snap.data()
    return functions.logger.log('New Message >>>', context.params.documentId, newVal.contact)

    //push notifications
    //admin.messaging()
});

exports.onUserUpdates = functions.firestore.document('/users/{userId}')
.onUpdate((change, context) => {
    const newVal = change.after.data();
    const oldVal = change.before.data();
    return functions.logger.log('New user name', context.params.userId, newVal.firstname)

    //push notifications
});

exports.onUserSubCollectionChanges = functions.firestore.document('/users/{userId}/{activityCollectionId}/{activityId}')
.onUpdate((change, context) => {
    const newVal = change.after.data();
    const oldVal = change.before.data();
    return functions.logger.log('activity new name', context.params.userId, newVal.name)

    //push notifications
});


exports.onDeleteUser = functions.firestore.document('/users/{userId}')
.onDelete((snap, context) => {
    const deletedData = snap.data();
    return functions.logger.log('A user was deleted !!', context.params.userId, deletedData.firstname)

})