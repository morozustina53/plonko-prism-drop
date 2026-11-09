import React from 'react';
import {StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import {theme} from '../constants/theme';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glow?: string;
};

export const GlassPanel: React.FC<Props> = ({children, style, glow}) => (
  <View
    style={[
      styles.panel,
      glow
        ? {
            shadowColor: glow,
            shadowOpacity: 0.45,
            shadowRadius: 20,
            shadowOffset: {width: 0, height: 8},
            elevation: 10,
          }
        : null,
      style,
    ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.colors.glass,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    padding: 16,
  },
});

export default GlassPanel;
