<h1 align="center">Say Hello to <a href="https://ayoni.vercel.app/">Ayoni</a>
</h1>
 <img width="1000" alt="header image" src="/ogayoni.png">

### **Key Features:**

- **⚡ Simple Integration:** Add one script tag to your website — that’s it.
- **🌐 Website Analytics:** Track real-time page views, top pages, referrers, browsers and devices.
- **📈 Custom Dashboard:** View beautiful, clean analytics in your own dashboard.

---

### **📄 How to Use Ayoni**

1. **Create a Website:**

   - Go to the dashboard.
   - Add your site name and domain.

2. **Copy the Tracking Script:**
   Paste this into your website's `<head>`:

   ```html
   <script
     async
     src="https://ayoni.vercel.app/tracker.js"
     data-website-id="YOUR_WEBSITE_ID"
   ></script>
   ```

3. **View Analytics:**
   - Open the dashboard.
   - Select your website to view page views, top URLs, browsers, and more.

---

### **Tech Stack:**

- Nextjs
- TypeScript
- Shadcn
- Postgres
- Prisma
- Tailwind
- NextAuth

### **Setting up locally**

```bash
git clone https://github.com/ronitrajfr/Ayoni.git
cd Ayoni
bun install
```

Change `.env.example` to `.env`, then add the PostgreSQL url (you can get one for free from NeonDB) and Google secret and client id & uploadthing keys.

And then run :

```bash
bun run dev
```
