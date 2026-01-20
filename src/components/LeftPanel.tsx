import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import HeroBackground from "../../assets/images/hero-background.svg";
import colors from "../theme/colors";

// Fallback to individual images if SVG doesn't work
const Person = require("../../assets/images/Group 16.png");

interface LeftPanelProps {
  headline: string;
  subheadline: string;
  showHero?: boolean;
  showPills?: boolean;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  headline,
  subheadline,
  showHero = true,
  showPills = true,
}) => {
  return (
    <View key={`left-panel-${headline}`} style={styles.left}>
      <View style={styles.leftInner}>
        {/* Hero background with grid pattern from Figma */}
        <HeroBackground
          key={`hero-bg-${headline}`} // Force re-render for each page
          width="100%"
          height="100%"
          style={StyleSheet.absoluteFillObject}
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Headline card */}
        <View style={styles.headlineCard}>
          <Text style={styles.leftHeadline}>{headline}</Text>
          <Text style={styles.leftSub}>{subheadline}</Text>
        </View>

        {/* Hero illustration with person and stickers */}
        {showHero && (
          <View style={styles.heroContainer}>
            <Image source={Person} style={styles.person} resizeMode="contain" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  left: { flex: 1.1, padding: 24 },
  leftInner: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  headlineCard: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    zIndex: 10,
  },
  leftHeadline: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "600",
    marginBottom: 10,
    lineHeight: 58,
    textAlign: "center",
  },
  leftSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 17,
    lineHeight: 27,
    textAlign: "center",
  },
  heroContainer: {
    position: "absolute",
    top: 180,
    left: 0,
    right: 0,
    bottom: -65,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 1,
  },
  person: {
    width: 750,
    height: 770,
    zIndex: 2,
  },
  bottomRow: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 3,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  pillText: {
    fontWeight: "700",
    color: "#111827",
    fontSize: 14,
  },
});

export default LeftPanel;
