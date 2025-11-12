import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";

const ChatBackgroundPattern: React.FC = () => {
  // Create a tiled grid pattern similar to Figma design (3x3 grid)
  const rows = 3;
  const cols = 3;
  const patternSize = 794; // Approximate size from Figma

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: cols }).map((_, colIndex) => (
          <ImageBackground
            key={`${rowIndex}-${colIndex}`}
            source={require("../../../assets/images/chat_background.png")}
            style={[
              styles.patternItem,
              {
                top: rowIndex * patternSize - 243,
                left: colIndex * patternSize - 439,
                width: patternSize,
                height: patternSize,
              },
            ]}
            resizeMode="cover"
            imageStyle={styles.patternImage}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: "hidden",
  },
  patternItem: {
    position: "absolute",
  },
  patternImage: {
    opacity: 0.05, // Very subtle pattern like in Figma
  },
});

export default ChatBackgroundPattern;
