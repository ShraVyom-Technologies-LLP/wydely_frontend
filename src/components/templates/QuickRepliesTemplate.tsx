import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TemplateMessage, TemplateTitle } from '../TemplateMessage';
import { Chip } from './Chip';

export type QuickReplyOption = {
  id: string;
  label: string;
  onPress?: () => void;
};

export type QuickRepliesTemplateProps = {
  title: string;
  body?: string;
  options: QuickReplyOption[];
  align?: 'left' | 'right';
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'read';
  maxWidth?: number;
};

export function QuickRepliesTemplate({
  title,
  body = 'Choose one option:',
  options,
  align = 'right',
  timestamp,
  status,
  maxWidth = 360,
}: QuickRepliesTemplateProps) {
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
        <View style={styles.chipsRow}>
          {options.map((option) => (
            <Chip key={option.id} label={option.label} onPress={option.onPress} />
          ))}
        </View>
      }
      timestamp={timestamp}
      status={status}
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 6,
    paddingBottom: 2,
  },
});
