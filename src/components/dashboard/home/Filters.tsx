import React, { useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import {
  AGE_LIMIT,
  AVAILABILITY,
  Filter,
  VACCINE,
} from '../../../services/models/filters';
import useStyle from './styles';

interface Props {
  filter: Filter;
  setFilter: (arg1: Filter) => void;
  filterAnim: Animated.Value;
}
const Filters = ({ filter, setFilter, filterAnim }: Props) => {
  const styles = useStyle();
  const [filterLocal, setFilterLocal] = useState<Filter>(filter);
  return (
    <Animated.View
      style={[
        styles.filterParent,
        {
          position: 'absolute',
          top: -140,
          left: 0,
          right: 0,
          zIndex: 3,
          height: 220,
          backgroundColor: styles.parent.backgroundColor,
          transform: [
            {
              translateY: filterAnim,
            },
          ],
        },
      ]}>
      <Text style={styles.filterSection}>VACCINE</Text>
      <View style={styles.filterVaccine}>
        <Pressable
          onPress={() => {
            setFilterLocal({
              ...filterLocal,
              vaccine: undefined,
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color: filter?.vaccine
                  ? styles.filterText.color
                  : styles.selectedDayStyle.color,
              },
            ]}>
            All
          </Text>
        </Pressable>
        <Text style={styles.filterSeparator}> / </Text>
        <Pressable
          onPress={() => {
            setFilterLocal({
              ...filterLocal,
              vaccine: VACCINE.SPUTNIK,
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.vaccine === VACCINE.SPUTNIK
                    ? styles.selectedDayStyle.color
                    : styles.filterText.color,
              },
            ]}>
            SPUTNIK
          </Text>
        </Pressable>
        <Text style={styles.filterSeparator}> / </Text>
        <Pressable
          onPress={() => {
            setFilterLocal({
              ...filterLocal,
              vaccine: VACCINE.COVISHIELD,
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.vaccine === VACCINE.COVISHIELD
                    ? styles.selectedDayStyle.color
                    : styles.filterText.color,
              },
            ]}>
            COVISHIELD
          </Text>
        </Pressable>
        <Text style={styles.filterSeparator}> / </Text>
        <Pressable
          onPress={() => {
            setFilterLocal({
              ...filterLocal,
              vaccine: VACCINE.COVAXIN,
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.vaccine === VACCINE.COVAXIN
                    ? styles.selectedDayStyle.color
                    : styles.filterText.color,
              },
            ]}>
            COVAXINE
          </Text>
        </Pressable>
      </View>
      <Text style={styles.filterSection}>AGE</Text>
      <View style={styles.filterAge}>
        <Pressable
          onPress={() => {
            setFilterLocal({
              ...filterLocal,
              min_age_limit: undefined,
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.min_age_limit === undefined
                    ? styles.selectedDayStyle.color
                    : styles.filterText.color,
              },
            ]}>
            All
          </Text>
        </Pressable>
        <Text style={styles.filterSeparator}> / </Text>
        <Pressable
          onPress={() => {
            setFilterLocal({
              ...filterLocal,
              min_age_limit: AGE_LIMIT.MIN_18,
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.min_age_limit === AGE_LIMIT.MIN_18
                    ? styles.selectedDayStyle.color
                    : styles.filterText.color,
              },
            ]}>
            18+
          </Text>
        </Pressable>
        <Text style={styles.filterSeparator}> / </Text>
        <Pressable
          onPress={() => {
            setFilterLocal({
              ...filterLocal,
              min_age_limit: AGE_LIMIT.MIN_45,
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.min_age_limit === AGE_LIMIT.MIN_45
                    ? styles.selectedDayStyle.color
                    : styles.filterText.color,
              },
            ]}>
            45+
          </Text>
        </Pressable>
      </View>
      <Text style={styles.filterSection}>DOSE AVAILABILITY</Text>
      <View style={styles.filterAge}>
        <Pressable
          onPress={() => {
            setFilterLocal({
              ...filterLocal,
              availability: AVAILABILITY.AVAILABLE,
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.availability === AVAILABILITY.AVAILABLE
                    ? styles.selectedDayStyle.color
                    : styles.filterText.color,
              },
            ]}>
            Hide 0 available
          </Text>
        </Pressable>
        <Text style={styles.filterSeparator}> / </Text>
        <Pressable
          onPress={() => {
            setFilterLocal({
              ...filterLocal,
              availability: AVAILABILITY.DOSE_1,
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.availability === AVAILABILITY.DOSE_1
                    ? styles.selectedDayStyle.color
                    : styles.filterText.color,
              },
            ]}>
            1st
          </Text>
        </Pressable>
        <Text style={styles.filterSeparator}> / </Text>
        <Pressable
          onPress={() => {
            setFilterLocal({
              ...filterLocal,
              availability: AVAILABILITY.DOSE_2,
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.availability === AVAILABILITY.DOSE_2
                    ? styles.selectedDayStyle.color
                    : styles.filterText.color,
              },
            ]}>
            2nd
          </Text>
        </Pressable>
      </View>
      <Pressable
        onPress={() => {
          setFilterLocal({
            vaccine: undefined,
            min_age_limit: undefined,
            availability: undefined,
          });
        }}>
        <Text style={styles.filterReset}>RESET</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setFilterLocal({
            vaccine: undefined,
            min_age_limit: undefined,
            availability: undefined,
          });
        }}>
        <Text style={styles.filterReset}>APPLY</Text>
      </Pressable>
    </Animated.View>
  );
};

export default Filters;
