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
    .onCreate(async (snap, context) => {
    const newVal = snap.data()
    const tokensList = newVal.people.map(item => item.tokenId);
    const payload = {
        notification: {
            title: 'First Aid',
            body: 'Your friend is in danger !'
        }
    }
    const response = await admin.messaging().sendToDevice(tokensList, payload)
    response.results.forEach((result, index) => {
        const error = result.error
        if (error) {
            functions.logger.log('Failed to send notification to', tokensList[index], error)
        }
    })

    return functions.logger.log('Message sent successfully', context.params.documentId, newVal.firstname)

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
