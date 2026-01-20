import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import colors from '../theme/colors';

const ShimmerScreen: React.FC = () => {
  const shimmerAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {/* Header Shimmer */}
      <View style={styles.headerShimmer}>
        <Animated.View style={[styles.shimmerBox, { opacity, height: 40, width: 200 }]} />
        <Animated.View style={[styles.shimmerBox, { opacity, height: 20, width: 150 }]} />
      </View>

      {/* Content Shimmer */}
      <View style={styles.contentShimmer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={styles.rowShimmer}>
            <Animated.View
              style={[styles.shimmerBox, { opacity, height: 60, width: 60, borderRadius: 30 }]}
            />
            <View style={styles.textShimmer}>
              <Animated.View
                style={[styles.shimmerBox, { opacity, height: 16, width: '70%', marginBottom: 8 }]}
              />
              <Animated.View style={[styles.shimmerBox, { opacity, height: 14, width: '50%' }]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
  },
  headerShimmer: {
    marginBottom: 32,
    gap: 12,
  },
  contentShimmer: {
    gap: 16,
  },
  rowShimmer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  textShimmer: {
    flex: 1,
  },
  shimmerBox: {
    backgroundColor: colors.border,
    borderRadius: 8,
  },
});

export default ShimmerScreen;
