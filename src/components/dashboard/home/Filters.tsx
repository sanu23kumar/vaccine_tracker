import React from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import useStyle from './styles';

const Filters = ({ filter, setFilter, filterAnim }) => {
  const styles = useStyle();

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
            setFilter({
              ...filter,
              vaccine: '',
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.vaccine === ''
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
            setFilter({
              ...filter,
              vaccine: 'SPUTNIK',
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.vaccine === 'SPUTNIK'
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
            setFilter({
              ...filter,
              vaccine: 'COVISHIELD',
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.vaccine === 'COVISHIELD'
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
            setFilter({
              ...filter,
              vaccine: 'COVAXIN',
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.vaccine === 'COVAXIN'
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
            setFilter({
              ...filter,
              min_age_limit: '',
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.min_age_limit === ''
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
            setFilter({
              ...filter,
              min_age_limit: '18',
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.min_age_limit === '18'
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
            setFilter({
              ...filter,
              min_age_limit: '45',
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.min_age_limit === '45'
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
            setFilter({
              ...filter,
              availability: 'available_capacity',
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.availability === 'available_capacity'
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
            setFilter({
              ...filter,
              availability: 'available_capacity_dose1',
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.availability === 'available_capacity_dose1'
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
            setFilter({
              ...filter,
              availability: 'available_capacity_dose2',
            });
          }}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  filter?.availability === 'available_capacity_dose2'
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
          setFilter({
            vaccine: '',
            min_age_limit: '',
            availability: '',
          });
        }}>
        <Text style={styles.filterReset}>RESET</Text>
      </Pressable>
    </Animated.View>
  );
};

export default Filters;
