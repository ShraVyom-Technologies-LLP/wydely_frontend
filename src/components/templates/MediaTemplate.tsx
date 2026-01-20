import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { TemplateMessage, TemplateTitle, WAAction } from '../TemplateMessage';

export type MediaThumbnail = {
  id: string;
  uri?: string;
  placeholderColor?: string;
};

export type MediaTemplateProps = {
  title: string;
  body?: string;
  thumbnails?: MediaThumbnail[];
  action?: WAAction;
  align?: 'left' | 'right';
  timestamp?: string;
  maxWidth?: number;
};

export function MediaTemplate({
  title,
  body = 'Tap a thumbnail to preview or download.',
  thumbnails = [],
  action,
  align = 'left',
  timestamp,
  maxWidth = 340,
}: MediaTemplateProps) {
  return (
    <TemplateMessage
      align={align}
      body={
        <View>
          <TemplateTitle>{title}</TemplateTitle>
          <Text style={styles.body}>{body}</Text>
        </View>
      }
      footer={
        thumbnails.length > 0 ? (
          <View style={styles.thumbRow}>
            {thumbnails.map((thumb) => (
              <View key={thumb.id} style={styles.thumbContainer}>
                {thumb.uri ? (
                  <Image source={{ uri: thumb.uri }} style={styles.thumb} />
                ) : (
                  <View
                    style={[styles.thumb, { backgroundColor: thumb.placeholderColor || '#CBD5E1' }]}
                  />
                )}
              </View>
            ))}
          </View>
        ) : null
      }
      actions={action ? [action] : undefined}
      timestamp={timestamp}
      maxWidth={maxWidth}
    />
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F172A',
  },
  thumbRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
    paddingBottom: 2,
  },
  thumbContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumb: {
    width: 62,
    height: 62,
    borderRadius: 12,
  },
});
