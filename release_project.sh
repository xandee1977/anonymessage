#!/bin/bash
  echo "Building release..."
  cordova build --release android

  echo "Signing release..."
  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore anonymessage.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk anonymessage

  echo "Zipaligning release... (copy to /tmp/anonymessage-release-$1)"
  zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk /tmp/anonymessage-release-$1.apk