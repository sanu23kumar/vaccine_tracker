import React from 'react';
import { Pressable, Text, View } from 'react-native';
import fonts from '../../../assets/fonts';
import {
  AGE_LIMIT,
  AVAILABILITY,
  FEE_TYPE,
  VACCINE,
} from '../../../services/models/centers';
import { NotificationFilter } from '../../../services/models/filters';
import useStyle from './styles';

const Separator = () => {
  const styles = useStyle();
  return <Text style={styles.filterSeparator}>|</Text>;
};

interface Props {
  name: string;
  type: string;
  filter: VACCINE | AVAILABILITY | AGE_LIMIT | FEE_TYPE | undefined;
  separator?: boolean;
  filterLocal: NotificationFilter;
  setLocalFilterHelper: (arg1: NotificationFilter) => void;
}

const FilterType = ({
  name,
  type,
  filter,
  separator,
  filterLocal,
  setLocalFilterHelper,
}: Props) => {
  const styles = useStyle();
  const onPressFilter = () => {
    setLocalFilterHelper({ ...filterLocal, [type]: filter });
  };
  const selected = filterLocal[type] === filter;
  return (
    <View style={styles.filterType}>
      <Pressable onPress={onPressFilter} hitSlop={8}>
        <Text
          style={[
            styles.filterText,
            {
              color: selected
                ? styles.selectedDayStyle.color
                : styles.filterText.color,
              fontFamily: selected ? fonts.MEDIUM : fonts.REGULAR,
            },
          ]}>
          {name}
        </Text>
      </Pressable>
      {!separator ? null : <Separator />}
    </View>
  );
};

export default FilterType;
