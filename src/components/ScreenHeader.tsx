import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from '../constants/theme';

type Props = {
  title: string;
  kicker?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

/**
 * ONE header for every screen of the app (Game, Result, How to play,
 * Settings). Screens differ only by what they pass into the slots, so the
 * badge / back-button / counter styling can never drift between them.
 */
export const ScreenHeader: React.FC<Props> = ({title, kicker, leftSlot, rightSlot}) => (
  <View style={styles.header}>
    <View style={styles.side}>{leftSlot}</View>
    <View style={styles.center}>
      {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
    <View style={styles.sideRight}>{rightSlot}</View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    paddingTop: 44,
    height: 116,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: theme.colors.scrim,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
  },
  side: {width: 92, alignItems: 'flex-start', justifyContent: 'center'},
  sideRight: {width: 92, alignItems: 'flex-end', justifyContent: 'center'},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  kicker: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: theme.colors.textPrimary,
  },
});

export default ScreenHeader;
