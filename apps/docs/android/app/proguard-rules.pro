# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Preserve line numbers and source file attributes for Play Store stack trace deobfuscation
-keepattributes SourceFile,LineNumberTable,Signature,InnerClasses,EnclosingMethod,Exceptions,*Annotation*
-renamesourcefileattribute SourceFile

# Capacitor Core & Bridge Reflection
-keep public class com.getcapacitor.** { *; }
-keep public class * extends com.getcapacitor.Plugin { *; }
-keep public class * extends com.getcapacitor.Bridge { *; }
-keep public class * extends com.getcapacitor.BridgeActivity { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    public *;
}
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public *;
    @com.getcapacitor.annotation.CapacitorPlugin public *;
}

# Preserve JavaScript Interface methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Capgo Live Updater Plugin
-keep public class ee.forgr.capacitor_updater.** { *; }
-keepclassmembers class ee.forgr.capacitor_updater.** { *; }

# Cordova Plugin Compatibility
-keep public class org.apache.cordova.** { *; }
-keepclassmembers class * extends org.apache.cordova.CordovaPlugin {
    public *;
}
