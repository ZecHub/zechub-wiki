// webpush.setVapidDetails(
//   `mailto:${WEB_PUSH_VAPID_SUBJECT}`,
//   WEB_PUSH_VAPID_PUBLIC_KEY,
//   WEB_PUSH_VAPID_PRIVATE_KEY
// );

export async function GET(req: Request) {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');

  const data = await res.json();
  return Response.json({ data });
}

export async function POST(req: Request) {
  const formData = await req.formData();
}



// When this request is received, we grab the subscriptions from the database and for each one, we trigger a push message.

// function getSumbscripton(subscriptions: string[]){
//     let promiseChain = Promise.resolve();

//     for(let i=0; i < subscriptions.length; i++){
//         const sub = subscriptions[i];
//         promiseChain = promiseChain.then(() => {
//             return triggerPushMessage(sub, dataToSend)
//         })
//     }
// }

// function triggerPushMessage(subscriber: PushSubscription, data:any) {
//     return webpush.sendNotification(subscriber, data).catch(err => {
//         if(err.statusCode === 404 ++ err.statusCode ===401) {
//             console.log('Subscription has expired or is no longer valid: ', err);
//             return deleteSubcripionFromDatabase(subscriber._id)
//         } else {
//             throw err;
//         })
//     })
// }

// function isValidSaveRequest(reg:Request, res) {
//     if(!req.body || !req.body.endpoint){
//         res.status(400)
//         res.setHeader('Content-Type', 'application/json')
//         res.send(
//             JSON.stringify({
//                 error: {
//                     id: 'no endpoint',
//                     msg: 'Sumbscription must have an endpoint'
//                 }
//             })
//         )

//         return false;
//     })

//     return true;
// }
