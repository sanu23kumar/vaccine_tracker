import React, { useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import {
  AGE_LIMIT,
  AVAILABILITY,
  FEE_TYPE,
  VACCINE,
} from '../../../services/models/centers';
import { Filter, FILTER_KEYS } from '../../../services/models/filters';
import FilterType from './FilterType';
import useStyle from './styles';

export const FILTER_COMPONENT_SIZE = 285;
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

  const onPressReset = () => {
    setFilter({
      vaccine: undefined,
      min_age_limit: undefined,
      availability: undefined,
    });
    setFilterLocal({
      vaccine: undefined,
      min_age_limit: undefined,
      availability: undefined,
    });
  };

  const onPressApply = () => {
    setFilter(filterLocal);
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
        <FilterType
          name="All"
          type={FILTER_KEYS.VACCINE}
          filter={undefined}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name="SPUTNIK"
          type={FILTER_KEYS.VACCINE}
          filter={VACCINE.SPUTNIK}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name="COVISHIELD"
          type={FILTER_KEYS.VACCINE}
          filter={VACCINE.COVISHIELD}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name="COVAXIN"
          type={FILTER_KEYS.VACCINE}
          filter={VACCINE.COVAXIN}
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
      </View>
      <Text style={styles.filterSectionTitle}>AGE</Text>
      <View style={styles.filterSection}>
        <FilterType
          name="All"
          type={FILTER_KEYS.MIN_AGE_LIMIT}
          filter={undefined}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name="18+"
          type={FILTER_KEYS.MIN_AGE_LIMIT}
          filter={AGE_LIMIT.MIN_18}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name="45+"
          type={FILTER_KEYS.MIN_AGE_LIMIT}
          filter={AGE_LIMIT.MIN_45}
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
      </View>
      <Text style={styles.filterSectionTitle}>COST</Text>
      <View style={styles.filterSection}>
        <FilterType
          name="All"
          type={FILTER_KEYS.FEE_TYPE}
          filter={undefined}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name="Free"
          type={FILTER_KEYS.FEE_TYPE}
          filter={FEE_TYPE.FREE}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name="Paid"
          type={FILTER_KEYS.FEE_TYPE}
          filter={FEE_TYPE.PAID}
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
      </View>
      <Text style={styles.filterSectionTitle}>DOSE AVAILABILITY</Text>
      <View style={styles.filterSection}>
        <FilterType
          name="Any"
          type={FILTER_KEYS.AVAILABILITY}
          filter={AVAILABILITY.AVAILABLE}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name="1st"
          type={FILTER_KEYS.AVAILABILITY}
          filter={AVAILABILITY.DOSE_1}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name="2nd"
          type={FILTER_KEYS.AVAILABILITY}
          filter={AVAILABILITY.DOSE_2}
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
      </View>
      <View style={styles.filterAction}>
        <Pressable
          style={styles.filterActionButtonApply}
          onPress={onPressApply}>
          <Text style={styles.filterApply}>APPLY</Text>
        </Pressable>
        <Pressable
          style={styles.filterActionButtonReset}
          onPress={onPressReset}>
          <Text style={styles.filterReset}>RESET</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default Filters;
