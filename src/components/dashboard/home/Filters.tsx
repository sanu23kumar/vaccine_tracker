import { default as React, default as React, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import {
  AGE_LIMIT,
  AVAILABILITY,
  VACCINE,
} from '../../../services/models/centers';
import { Filter } from '../../../services/models/filters';
import useStyle from './styles';

const Separator = () => {
  const styles = useStyle();
  return <Text style={styles.filterSeparator}> / </Text>;
};
interface Props {
  filter: Filter;
  setFilter: (arg1: Filter) => void;
  filterAnim: Animated.Value;
}
const Filters = ({ filter, setFilter, filterAnim }: Props) => {
  const styles = useStyle();
  const [filterLocal, setFilterLocal] = useState<Filter>(filter);

  const setLocalFilterHelper = (filter: Filter) => {
    setFilterLocal({
      ...filterLocal,
      ...filter,
    });
  };

  const filterStyle = (selected: boolean) => ({
    color: selected ? styles.selectedDayStyle.color : styles.filterText.color,
  });

  const onPressAllVaccine = () => {
    setLocalFilterHelper({ vaccine: undefined });
  };

  const onPressCovaxin = () => {
    setLocalFilterHelper({ vaccine: VACCINE.COVAXIN });
  };

  const onPressSputnik = () => {
    setLocalFilterHelper({ vaccine: VACCINE.SPUTNIK });
  };

  const onPressCovishield = () => {
    setFilterLocal({
      ...filterLocal,
      vaccine: VACCINE.COVISHIELD,
    });
  };

  const onPressReset = () => {
    setFilterLocal({
      vaccine: undefined,
      min_age_limit: undefined,
      availability: undefined,
    });
  };

  const onPressApply = () => {
    setFilter(filterLocal);
  };

  const FilterType = ({
    name,
    type,
    filter,
    separator,
  }: {
    name: string;
    type: string;
    filter: VACCINE | AVAILABILITY | AGE_LIMIT | undefined;
    separator?: boolean;
  }) => {
    const onPressFilter = () => {
      setLocalFilterHelper({ [type]: filter });
    };
    const selected = filterLocal[type] === filter;
    return (
      <View>
        <Pressable onPress={onPressFilter}>
          <Text
            style={[
              styles.filterText,
              {
                color: selected
                  ? styles.selectedDayStyle.color
                  : styles.filterText.color,
              },
            ]}>
            {name}
          </Text>
        </Pressable>
        {!separator ? null : <Separator />}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.filterParent,
        {
          transform: [
            {
              translateY: filterAnim,
            },
          ],
        },
      ]}>
      <Text style={styles.filterSectionTitle}>VACCINE</Text>
      <View style={styles.filterSection}>
        <FilterType name="All" type="vaccine" filter={undefined} separator />
        <FilterType
          name="SPUTNIK"
          type="vaccine"
          filter={VACCINE.SPUTNIK}
          separator
        />
        <FilterType
          name="COVISHIELD"
          type="vaccine"
          filter={VACCINE.COVISHIELD}
          separator
        />
        <FilterType name="COVAXIN" type="vaccine" filter={VACCINE.COVAXIN} />
      </View>
      <Text style={styles.filterSectionTitle}>AGE</Text>
      <View style={styles.filterSection}>
        <FilterType
          name="All"
          type="min_age_limit"
          filter={undefined}
          separator
        />
        <FilterType
          name="18+"
          type="min_age_limit"
          filter={AGE_LIMIT.MIN_18}
          separator
        />
        <FilterType name="45+" type="min_age_limit" filter={AGE_LIMIT.MIN_18} />
      </View>
      <Text style={styles.filterSectionTitle}>DOSE AVAILABILITY</Text>
      <View style={styles.filterSection}>
        <FilterType
          name="Any"
          type="availability"
          filter={AVAILABILITY.AVAILABLE}
          separator
        />
        <FilterType
          name="1st"
          type="availability"
          filter={AVAILABILITY.DOSE_1}
          separator
        />
        <FilterType
          name="2nd"
          type="availability"
          filter={AVAILABILITY.DOSE_2}
          separator
        />
      </View>
      <Pressable onPress={onPressReset}>
        <Text style={styles.filterReset}>RESET</Text>
      </Pressable>
      <Pressable onPress={onPressApply}>
        <Text style={styles.filterReset}>APPLY</Text>
      </Pressable>
    </Animated.View>
  );
};

export default Filters;
