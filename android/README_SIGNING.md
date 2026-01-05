# Signing Android APK (Capacitor project)

This project uses Capacitor and the Android native project is under `android/`.

To build a signed release APK in CI you need to:

1. Create a Java keystore (.jks or .keystore) locally using keytool:

   ```bash
   keytool -genkey -v -keystore release.keystore -alias my-key-alias \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Encode the keystore to base64 and add it as a GitHub Secret named `KEYSTORE_BASE64`:

   ```bash
   base64 release.keystore | pbcopy   # macOS
   base64 release.keystore | xclip    # Linux (xclip)
   ```

   Then paste the base64 into a GitHub secret. Also add these secrets:
   - `KEYSTORE_PASSWORD` (the keystore password)
   - `KEY_ALIAS` (the alias used)
   - `KEY_PASSWORD` (the key password, often same as keystore password)

3. Configure Gradle to read signing properties. Add a `keystore.properties` loader
   in `android/app/build.gradle` (example snippet below) and ensure the file
   `android/keystore.properties` is created by the CI (workflow decodes it).

Example Gradle snippet (add inside `android/app/build.gradle` android block):

```groovy
// At top of file (apply plugin area)
def keystorePropsFile = rootProject.file('keystore.properties')
def keystoreProps = new Properties()
if (keystorePropsFile.exists()) {
  keystoreProps.load(new FileInputStream(keystorePropsFile))
}

android {
  signingConfigs {
    release {
      storeFile file(keystoreProps['storeFile'] ?: 'release.keystore')
      storePassword keystoreProps['storePassword'] ?: System.getenv('KEYSTORE_PASSWORD')
      keyAlias keystoreProps['keyAlias'] ?: System.getenv('KEY_ALIAS')
      keyPassword keystoreProps['keyPassword'] ?: System.getenv('KEY_PASSWORD')
    }
  }

  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled false
      // other release configs
    }
  }
}
```

4. The GitHub Actions workflow (provided in `.github/workflows/android-build.yml`) contains
   commented steps to decode the `KEYSTORE_BASE64` secret into `android/app/release.keystore`,
   create `android/keystore.properties`, and run `./gradlew assembleRelease`.

After adding the secrets in GitHub and uncommenting the workflow steps, the CI will
produce a signed `app-release.apk` artifact.
