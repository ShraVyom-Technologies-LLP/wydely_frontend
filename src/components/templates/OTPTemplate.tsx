import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TemplateMessage, TemplateNote } from '../TemplateMessage';

export type OTPTemplateProps = {
  recipientName?: string;
  code: string;
  expiryMinutes?: number;
  warningText?: string;
  align?: 'left' | 'right';
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'read';
  maxWidth?: number;
};

export function OTPTemplate({
  recipientName = 'User',
  code,
  expiryMinutes = 10,
  warningText = 'Do not share this code with anyone.',
  align = 'right',
  timestamp,
  status,
  maxWidth = 360,
}: OTPTemplateProps) {
  return (
    <TemplateMessage
      align={align}
      body={
        <Text style={styles.body}>
          Hi {recipientName} 👋 Your verification code is{' '}
          <Text style={{ fontWeight: '900' }}>{code}</Text>. It will expire in {expiryMinutes}{' '}
          minutes.
        </Text>
      }
      footer={<TemplateNote>{warningText}</TemplateNote>}
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
});
