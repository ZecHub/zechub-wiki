export default function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>

      <p>This sample page works for the push message home</p>

      {/* TODO: fetch list of subscribers here */}
      <h2> Send Push Message</h2>
      <p>
        Clicking `Trigger Push Messager` will make an API request to
        `/api/trigger-push-msg` and will send message to all our users.
      </p>

      <form action='/api/trigger-push-msg/' method="post">
        <textarea name='' id='' cols={30} rows={10}></textarea>
        <button>Send Message</button>
      </form>
    </div>
  );
}
