# 🏆 Topper Math Hero - Learning Adventure Game & Admin Portal

A mobile-first learning adventure game from **Nursery to Class 10** with 50+ levels, Mathematics, English, Science, and Assam SEBA Class 6 Social Science (অসমীয়া), Daily Challenges, Badges, and a Realtime Firebase-powered Admin Monitoring Portal.

---

## 🚀 How to Push this Project to GitHub (Beginner Friendly Guide)

If you downloaded this project as a ZIP or are pushing from your computer or terminal:

### Step 1: Open Terminal / Command Prompt in this folder
```bash
git init
git add .
git commit -m "Initial commit: Topper Math Hero with Firebase RTDB & Auto APK Builder"
```

### Step 2: Create a new Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Enter Repository name: `topper-math-hero`.
3. Keep it **Public** (or Private).
4. Click **Create repository**.

### Step 3: Link & Push to GitHub
Copy the commands shown on GitHub (replace `YOUR_USERNAME`):
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/topper-math-hero.git
git push -u origin main
```

---

## 📱 How to Download the Android APK from GitHub

We have configured **GitHub Actions** (`.github/workflows/build-apk.yml`) so that **every time you push code to GitHub, an Android APK is built automatically!**

1. Go to your repository on GitHub in your browser.
2. Click on the **"Actions"** tab at the top.
3. You will see a workflow running named **"Build Android APK"**.
4. Wait 2–3 minutes until the green checkmark (✅) appears.
5. Click on the completed workflow run.
6. Scroll down to the **"Artifacts"** section at the bottom.
7. Click on **`TopperMathHero-Android-APK`** to download your ready-to-install `.apk` file!
8. Transfer the APK to your phone or send it via WhatsApp, tap on it, and install!

---

## 🛡️ Admin Portal Details
- **Password**: `nzali789987$&`
- **Firebase Realtime Database**: Synchronizes live student scores, accuracy, level progression, and dynamic top scorer rank.

---

## 💻 Local Development
```bash
# Install dependencies
npm install

# Run dev server on port 3000
npm run dev

# Build client & server
npm run build
```
