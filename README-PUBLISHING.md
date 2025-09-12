# Publishing Your PWA to the Google Play Store

This guide will walk you through the process of packaging your Progressive Web App (PWA) as an Android App Bundle (`.aab`) for the Google Play Store using **PWABuilder**.

PWABuilder is a tool from Microsoft that simplifies wrapping your PWA in a native shell. For Android, it uses a **Trusted Web Activity (TWA)**, which is the recommended approach from Google. A TWA allows your web app to run full-screen in a secure browser context, making it feel just like a native app.

## Before You Start: Package Name
You need to decide on a unique package name for your app, which acts as its ID on the Play Store. It follows a reverse domain name format (e.g., `com.yourcompany.appname`). In this guide, we will use `com.example.gadgetguide` as a placeholder. **You must replace this with your own unique ID.**

## Step 1: Analyze Your PWA with PWABuilder

1.  **Deploy your PWA:** Your PWA must be hosted on a live, HTTPS-enabled server. PWABuilder needs a public URL to analyze.
2.  **Go to [PWABuilder.com](https://www.pwabuilder.com/)**.
3.  **Enter your PWA's URL** in the input field and click "Start".
4.  **Review the Report Card:** PWABuilder will analyze your `manifest.json`, service worker, and security settings. It will give you a score and suggestions for improvement. Your current manifest is already in great shape, so you should see a high score.

## Step 2: Generate the Android Package

1.  After the analysis, click **"Next"** to go to the publishing page.
2.  Find the **"Android"** platform card and click **"Package for Stores"**.
3.  A dialog will appear with options. For the Google Play Store, the default options are generally correct. **Important:** Update the `Package ID` field to your chosen package name (e.g., `com.example.gadgetguide`).
4.  Click **"Generate"**. PWABuilder will now generate a `.zip` file containing your Android project. Download and unzip it.

## Step 3: The Crucial Step - Digital Asset Links

To prove you own both the website (your PWA) and the Android app, you must create a link between them. This is done with a file called `assetlinks.json`. **Your app will crash on startup if this is not configured correctly.**

### 3a. Get Your App's SHA-256 Fingerprint

The `assetlinks.json` file needs a unique security fingerprint from your app's signing key.

1.  **Create a Google Play Console Account:** If you don't have one, you'll need to register and pay the one-time fee.
2.  **Create a New App:** In the Play Console, create a new app. Make sure its package name matches the one you chose.
3.  **Enable App Signing by Google Play:** Navigate to your app's dashboard, then go to **Setup > App integrity**. Under the "App Signing" tab, Google Play will manage your app signing key. This is the recommended and easiest approach.
4.  **Copy the SHA-256 Fingerprint:** On that same page, you will find the "App signing key certificate". Copy the **SHA-256 certificate fingerprint**. It will look something like this: `FA:C6:17:45:DC:09:03:78:6F:44:8A:22:15:5E:D2:F0:45:A3:DF:6A:B9:3A:D0:2B:69:A3:3B:4C:46:12:2A:78`.

### 3b. Create and Host `assetlinks.json`

1.  **Create the file:** Create a new file named `assetlinks.json`.
2.  **Add the content:** Paste the following JSON into the file. **Replace the placeholder SHA-256 fingerprint and the `package_name`** with your own values.

    ```json
    [{
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "com.example.gadgetguide",
        "sha256_cert_fingerprints":
        ["FA:C6:17:45:DC:09:03:78:6F:44:8A:22:15:5E:D2:F0:45:A3:DF:6A:B9:3A:D0:2B:69:A3:3B:4C:46:12:2A:78"]
      }
    }]
    ```

3.  **Host the file:** Upload this file to your web server so it's accessible at `https://<your-domain>/.well-known/assetlinks.json`.
    *   It **must** be in a `.well-known` directory at the root of your domain.
    *   It **must** be served with the `Content-Type: application/json` header.
    *   It **must** be accessible without any redirects.

4.  **Verify:** You can use Google's official [Statement List Tester](https://developers.google.com/digital-asset-links/tools/generator) to verify that your `assetlinks.json` file is correctly set up.

## Step 4: Build and Submit to Google Play

The project downloaded from PWABuilder is a standard Android Studio project.

1.  **Install Android Studio:** If you don't have it, download and install it.
2.  **Open the Project:** Open the unzipped folder from PWABuilder in Android Studio.
3.  **Check App Details:** Open `app/build.gradle.kts`. Verify the `applicationId` matches your package name and update the `versionCode` and `versionName` for your release.
4.  **Build the App Bundle:** Go to **Build > Generate Signed Bundle / APK...**. Select **"Android App Bundle"** and follow the prompts. Since you are using Play App Signing, you can generate an *unsigned* bundle for your first upload, or create a new local upload key (recommended).
5.  **Upload to Play Console:** Go back to your app in the Google Play Console. Create a new "Internal testing" or "Production" release and upload the `.aab` file you just generated.

Google Play will process your bundle, sign it with the official key, and make it available to your users. The TWA will now be correctly linked to your website, and the app will launch without the browser's address bar.
