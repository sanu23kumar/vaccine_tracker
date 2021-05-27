import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useQuery } from 'react-query';
import strings from '../../../assets/strings';
import {
  filterCenters,
  findByDistrict,
  findCalendarByPin,
  suggestDistricts,
} from '../../../services';
import { getDate, getQueryDate } from '../../../services/date';
import useLocation from '../../../services/location/useLocation';
import { Center } from '../../../services/models/centers';
import { STATES_WITH_DISTRICTS } from '../../../services/models/districts';
import {
  LOCATION_TYPE_DISTRICT,
  LOCATION_TYPE_PIN,
} from '../../../services/models/user';
import { useUserStore } from '../../../services/stores';
import useBackgroundFetch from '../../../services/useBackgroundFetch';
import FullBannerAd from '../../common/ad';
import ErrorView from '../../common/error';
import VtHeader from '../../common/header';
import NoDataView from '../../common/no-data';
import AutocompleteHelper from './AutocompleteHelper';
import CalendarWeek from './CalendarWeek';
import Filters from './Filters';
import List from './List';
import useStyle from './styles';

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}
const Home = () => {
  const styles = useStyle();
  useBackgroundFetch();
  const {
    postalCode,
    isLoading: isLocationLoading,
    getLocation,
  } = useLocation();
  const scrollY = useRef(new Animated.Value(0)).current;
  // const { getPersistedData, setPersistedData } = useQueryStore();
  const [filter, setFilter] = useState({
    vaccine: '',
    min_age_limit: '',
    availability: '',
  });
  const { data: userData, setData: setUserData } = useUserStore();
  const [searchText, setSearchText] = useState(userData.location.name);
  const [queryCode, setQueryCode] = useState(userData.location);
  const [selectedDate, setSelectedDate] = useState(getDate());
  const [queryDate, setQueryDate] = useState(getQueryDate(selectedDate));
  const [isFilterPressed, setIsFilterPressed] = useState(false);
  const filterAnim = useRef(new Animated.Value(0)).current;

  const { data, refetch, isLoading, isError } = useQuery(
    ['Home', queryCode.code, queryDate],
    () =>
      queryCode.type === LOCATION_TYPE_DISTRICT
        ? findByDistrict(queryCode.code, queryDate)
        : findCalendarByPin(queryCode.code, queryDate),
  );

  useEffect(() => {
    if (isLocationLoading === 0 && postalCode) {
      setQueryCode({
        name: postalCode,
        code: parseInt(postalCode),
        type: LOCATION_TYPE_PIN,
      });
      setSearchText(postalCode);
      setUserData({
        location: {
          name: postalCode,
          code: parseInt(postalCode),
          type: LOCATION_TYPE_PIN,
        },
      });
    }
  }, [isLocationLoading, postalCode]);

  let centersForSelectedDate: Center[];
  if (data?.centers) {
    centersForSelectedDate = data.centers.filter(
      center =>
        center.sessions.filter(session => session.date === selectedDate)
          .length > 0,
    );
    centersForSelectedDate = filterCenters(centersForSelectedDate, {
      session: filter,
      availability: filter.availability,
    });
  }

  const findDistrictCodeByName = (name: string) => {
    const states = STATES_WITH_DISTRICTS;
    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      for (let j = 0; j < state.districts.length; j++) {
        const district = state.districts[j];
        if (name.toLowerCase().includes(district.district_name.toLowerCase())) {
          return district.district_id;
        }
      }
    }
    return -1;
  };

  const onEndEditing = () => {
    if (isNumeric(searchText)) {
      if (searchText.length !== 6) {
        ToastAndroid.show('Not a valid OTP', ToastAndroid.SHORT);
        return;
      }
      setQueryCode({
        name: searchText,
        code: parseInt(searchText),
        type: LOCATION_TYPE_PIN,
      });
      setUserData({
        location: {
          name: postalCode,
          code: parseInt(postalCode),
          type: LOCATION_TYPE_PIN,
        },
      });
    } else {
      const districtCode = findDistrictCodeByName(searchText);
      if (districtCode === -1) {
        ToastAndroid.show(
          'No districts found for name, please try again',
          ToastAndroid.SHORT,
        );
        return;
      }
      setQueryCode({
        name: searchText,
        code: districtCode,
        type: LOCATION_TYPE_DISTRICT,
      });
      setUserData({
        location: {
          name: searchText,
          code: districtCode,
          type: LOCATION_TYPE_DISTRICT,
        },
      });
    }
  };

  const setDate = (date: string) => {
    setSelectedDate(date);
    setQueryDate(getQueryDate(date));
  };

  const onPressLocation = () => {
    getLocation();
  };

  const onPressAutocompleteItem = ({ code, name }) => {
    setSearchText(name);
    setQueryCode({
      name,
      code,
      type: LOCATION_TYPE_DISTRICT,
    });
  };

  const onPressFilter = () => {
    Animated.spring(filterAnim, {
      toValue: isFilterPressed ? 0 : 220,
      useNativeDriver: true,
    }).start();

    setIsFilterPressed(!isFilterPressed);
  };

  const setFilterAndCloseSection = filter => {
    setFilter(filter);
    onPressFilter();
  };
  const isSearching = queryCode.name !== searchText;
  const filterCount =
    (filter.min_age_limit.length > 0 ? 1 : 0) +
    (filter.vaccine.length > 0 ? 1 : 0) +
    (filter.availability.length > 0 ? 1 : 0);
  return (
    <SafeAreaView style={styles.parent}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.parent.backgroundColor}
      />
      <VtHeader title={strings.dashboard.home.header}>
        <Pressable style={styles.filterHeaderParent} onPress={onPressFilter}>
          <Text
            style={[
              styles.filterHeaderText,
              {
                color: isFilterPressed
                  ? styles.selectedDayStyle.color
                  : styles.filterHeaderText.color,
              },
            ]}>
            FILTER
          </Text>
          <View>
            <Icon
              name="filter"
              size={20}
              color={
                isFilterPressed
                  ? styles.selectedDayStyle.color
                  : styles.filterHeaderText.color
              }
            />
            {filterCount < 1 ? null : (
              <View style={styles.filterCountParent}>
                <Text style={styles.filterCountText}>{filterCount}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </VtHeader>
      <Filters
        filter={filter}
        setFilter={setFilterAndCloseSection}
        filterAnim={filterAnim}
      />
      {isSearching ? null : isError ? (
        <ErrorView />
      ) : isLoading ? (
        <ActivityIndicator
          color={styles.selectedDayStyle.color}
          style={{ alignSelf: 'center', flex: 1 }}
        />
      ) : centersForSelectedDate?.length < 1 ? (
        <NoDataView />
      ) : (
        <List
          centersForSelectedDate={centersForSelectedDate}
          refetch={refetch}
          scrollY={scrollY}
        />
      )}
      <Animated.View
        style={{
          position: 'absolute',
          backgroundColor: styles.parent.backgroundColor,
          left: 0,
          right: 0,
          zIndex: 2,
          marginTop: 79,
          transform: [
            {
              translateY: Animated.add(
                scrollY.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
                filterAnim,
              ),
            },
          ],
        }}>
        <View style={styles.searchParent}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            style={styles.search}
            placeholder={strings.dashboard.home.search}
            placeholderTextColor={styles.placeholder.color}
            onSubmitEditing={onEndEditing}
          />
          <Pressable onPress={onPressLocation}>
            <Icon
              name="locate-outline"
              size={18}
              style={styles.locationIconStyle}
            />
          </Pressable>
        </View>

        {isSearching ? (
          <AutocompleteHelper
            suggestions={suggestDistricts(searchText)}
            onPress={onPressAutocompleteItem}
          />
        ) : (
          <CalendarWeek selectedDate={selectedDate} setSelectedDate={setDate} />
        )}
      </Animated.View>
      <FullBannerAd />
    </SafeAreaView>
  );
};

export default Home;
