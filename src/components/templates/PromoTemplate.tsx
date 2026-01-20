import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TemplateMessage, TemplateHeaderImage, TemplateTitle, WAAction } from '../TemplateMessage';

export type PromoTemplateProps = {
  imageUri: string;
  imageHeight?: number;
  title: string;
  body: string | React.ReactNode;
  actions: WAAction[];
  align?: 'left' | 'right';
  timestamp?: string;
  maxWidth?: number;
};

export function PromoTemplate({
  imageUri,
  imageHeight = 170,
  title,
  body,
  actions,
  align = 'left',
  timestamp,
  maxWidth = 340,
}: PromoTemplateProps) {
  return (
    <TemplateMessage
      align={align}
      header={<TemplateHeaderImage uri={imageUri} height={imageHeight} />}
      body={
        <View>
          <TemplateTitle>{title}</TemplateTitle>
          {typeof body === 'string' ? <Text style={styles.body}>{body}</Text> : body}
        </View>
      }
      actions={actions}
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
});
