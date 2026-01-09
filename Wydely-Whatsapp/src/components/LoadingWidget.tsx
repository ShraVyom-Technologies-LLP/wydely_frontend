import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../theme/colors';

type LoadingWidgetProps = {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
};

const LoadingWidget: React.FC<LoadingWidgetProps> = ({
  size = 'small',
  color = colors.primary,
  message,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <View style={styles.messageContainer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    marginTop: 8,
  },
});

export default LoadingWidget;
