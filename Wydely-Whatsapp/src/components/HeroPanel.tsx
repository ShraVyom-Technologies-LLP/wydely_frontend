import { View, Text, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../theme/colors";

export default function HeroPanel() {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={["#E6FFFB", "#F0F9FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* headline */}
      <View style={styles.header}>
        <Text style={styles.kicker}>Wassup CRM</Text>
        <Text style={styles.title}>
          Power Your WhatsApp Marketing in Minutes
        </Text>
        <Text style={styles.subtitle}>
          Create a free account and start engaging customers instantly.
        </Text>
      </View>

      {/* big circle */}
      <View style={styles.circleLarge} />

      {/* floating chips */}
      <View
        style={[styles.badge, { top: 80, left: 32, backgroundColor: "#fff" }]}
      >
        <View style={[styles.dot, { backgroundColor: "#14B8A6" }]} />
        <Text style={styles.badgeText}>Campaigns</Text>
      </View>
      <View
        style={[styles.badge, { top: 140, right: 28, backgroundColor: "#fff" }]}
      >
        <View style={[styles.dot, { backgroundColor: colors.decoBlue }]} />
        <Text style={styles.badgeText}>Flows</Text>
      </View>
      <View
        style={[
          styles.badge,
          { bottom: 90, left: 50, backgroundColor: "#fff" },
        ]}
      >
        <View style={[styles.dot, { backgroundColor: colors.decoYellow }]} />
        <Text style={styles.badgeText}>Broadcast</Text>
      </View>
      <View
        style={[
          styles.badge,
          { bottom: 40, right: 50, backgroundColor: "#fff" },
        ]}
      >
        <View style={[styles.dot, { backgroundColor: colors.decoPink }]} />
        <Text style={styles.badgeText}>Analytics</Text>
      </View>

      {/* decorative rings */}
      <View
        style={[
          styles.ring,
          { width: 260, height: 260, borderColor: "#D1FAE5" },
        ]}
      />
      <View
        style={[
          styles.ring,
          { width: 340, height: 340, borderColor: "#BFDBFE" },
        ]}
      />

      {/* footer hint */}
      <Text style={styles.footNote}>
        Trusted by fast-growing brands • Secure • Scales with you
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
    overflow: "hidden",
  },
  header: { maxWidth: 560, marginBottom: 16 },
  kicker: {
    color: colors.primaryDark,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: { color: colors.textSecondary, fontSize: 15 },
  circleLarge: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 520,
    backgroundColor: "#FFF7ED",
    left: -90,
    top: 140,
    opacity: 0.8,
  },
  ring: {
    position: "absolute",
    borderWidth: 1.5,
    borderRadius: 999,
    left: 140,
    top: 240,
  },
  badge: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "web" ? 8 : 6,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  badgeText: { marginLeft: 8, color: colors.text, fontWeight: "600" },
  dot: { width: 10, height: 10, borderRadius: 10 },
  footNote: {
    position: "absolute",
    bottom: 18,
    left: 28,
    color: colors.textSecondary,
    fontSize: 12.5,
  },
});
