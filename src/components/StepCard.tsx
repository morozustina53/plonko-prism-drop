import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from '../constants/theme';

type Props = {
  index: number;
  title: string;
  body: string;
  color: string;
};

export const StepCard: React.FC<Props> = ({index, title, body, color}) => (
  <View style={[styles.card, {borderColor: color + '44'}]}>
    <View style={[styles.chip, {backgroundColor: color + '22', borderColor: color + '77'}]}>
      <Text style={[styles.chipText, {color}]}>{index}</Text>
    </View>
    <View style={styles.text}>
      <Text style={[styles.title, {color}]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: 14,
  },
  chip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums']},
  text: {flex: 1},
  title: {fontSize: 15, fontWeight: '800', letterSpacing: 1.5, marginBottom: 3},
  body: {fontSize: 13, fontWeight: '500', lineHeight: 18, color: theme.colors.textSecondary},
});

export default StepCard;
