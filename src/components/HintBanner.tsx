import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from '../constants/theme';

type Props = {
  text: string;
  visible: boolean;
};

/** Names the GESTURE and its RESULT — the control is a tap on timing. */
export const HintBanner: React.FC<Props> = ({text, visible}) => {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.wrap} pointerEvents="none">
      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    maxWidth: '86%',
    backgroundColor: 'rgba(0,0,0,0.42)',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
});

export default HintBanner;
