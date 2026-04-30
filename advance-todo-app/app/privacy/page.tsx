export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-sm text-foreground">
      <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-8 text-muted-foreground">Last updated: April 30, 2026</p>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">1. What we collect</h2>
        <p className="text-muted-foreground">
          FlowTask collects your Google account name, email address, and profile picture
          when you sign in. If you grant Calendar access, we read and write events on
          your behalf solely to sync your todos with Google Calendar.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">2. How we use your data</h2>
        <p className="text-muted-foreground">
          Your data is used only to provide the FlowTask service — managing your todos,
          habits, and calendar events. We do not sell, share, or use your data for
          advertising or any third-party purposes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">3. Google Calendar access</h2>
        <p className="text-muted-foreground">
          FlowTask uses the Google Calendar API to create and manage calendar events
          linked to your todos. This access is used exclusively within the app and
          is never shared externally. You can revoke this access at any time from
          your Google Account settings.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">4. Data storage</h2>
        <p className="text-muted-foreground">
          Your todos, habits, and account information are stored securely in a
          PostgreSQL database hosted on Supabase. OAuth tokens are stored
          to enable Google Calendar sync and are never exposed publicly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">5. Data deletion</h2>
        <p className="text-muted-foreground">
          You can request deletion of all your data by contacting us at
          vk972832@gmail.com. We will delete your account and all associated
          data within 30 days.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">6. Contact</h2>
        <p className="text-muted-foreground">
          For any privacy-related questions, contact: vk972832@gmail.com
        </p>
      </section>
    </div>
  );
}
