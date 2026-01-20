import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TemplateMessage, TemplateTitle, WALink } from '../TemplateMessage';

export type LinksTemplateProps = {
  title: string;
  body?: string;
  links: WALink[];
  align?: 'left' | 'right';
  timestamp?: string;
  maxWidth?: number;
};

export function LinksTemplate({
  title,
  body = 'Here are the quick links you can use:',
  links,
  align = 'left',
  timestamp,
  maxWidth = 340,
}: LinksTemplateProps) {
  return (
    <TemplateMessage
      align={align}
      body={
        <View>
          <TemplateTitle>{title}</TemplateTitle>
          <Text style={styles.body}>{body}</Text>
        </View>
      }
      links={links}
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
