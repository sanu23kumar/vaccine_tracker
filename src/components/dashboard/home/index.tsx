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
import translations from '../../../assets/translations';
import {
  filterCenters,
  findAvailableSlots,
  suggestDistricts,
} from '../../../services';
import { getDate, getQueryDate } from '../../../services/date';
import useLocation from '../../../services/location/useLocation';
import { Center } from '../../../services/models/centers';
import { Filter } from '../../../services/models/filters';
import { LOCATION } from '../../../services/models/user';
import { useDistrictsStore, useUserStore } from '../../../services/stores';
import ErrorView from '../../common/error';
import VtHeader from '../../common/header';
import NoDataView from '../../common/no-data';
import AutocompleteHelper from './AutocompleteHelper';
import CalendarWeek from './CalendarWeek';
import Filters, { FILTER_COMPONENT_SIZE } from './Filters';
import List from './List';
import useStyle from './styles';

export const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value);
};
const Home = () => {
  const styles = useStyle();
  const {
    postalCode,
    isLoading: isLocationLoading,
    getLocation,
  } = useLocation();
  const scrollY = useRef(new Animated.Value(0)).current;
  // const { getPersistedData, setPersistedData } = useQueryStore();
  const { data: userData, setData: setUserData } = useUserStore();
  const [filter, setFilter] = useState<Filter>(userData.filter ?? {});
  const [searchText, setSearchText] = useState(userData.filter.location.name);
  const [isSearching, setIsSearching] = useState(false);
  const [queryCode, setQueryCode] = useState(userData.filter.location);
  const [selectedDate, setSelectedDate] = useState(getDate());
  const [queryDate, setQueryDate] = useState(getQueryDate(selectedDate));
  const [isFilterPressed, setIsFilterPressed] = useState(false);
  const filterAnim = useRef(new Animated.Value(0)).current;
  const { districtsData } = useDistrictsStore();

  const { data: queryData, refetch, isLoading, isError } = useQuery(
    ['Home', queryCode.code, queryDate],
    () => findAvailableSlots(queryCode.code, queryDate, queryCode.type),
  );
  const data = queryData ? queryData[queryDate] : null;
  const suggestions = suggestDistricts(searchText, districtsData.states);

  const setUser = (name: string, code: number, type: LOCATION) => {
    setQueryCode({ name, code, type });
    setUserData({
      filter: { ...userData.filter, location: { name, code, type } },
    });
  };

  useEffect(() => {
    if (!userData.filter.date) setDate(selectedDate);
  }, []);
  useEffect(() => {
    if (isLocationLoading === 0 && postalCode) {
      setSearchText(postalCode);
      setUser(postalCode, parseInt(postalCode), LOCATION.PIN);
    }
  }, [isLocationLoading, postalCode]);

  useEffect(() => {
    setSearchText(userData.filter.location.name);
  }, [userData]);

  let centersForSelectedDate: Center[];
  if (data?.centers) {
    centersForSelectedDate = data.centers.filter(
      center =>
        center.sessions.filter(session => session.date === selectedDate)
          .length > 0,
    );
    centersForSelectedDate = filterCenters(centersForSelectedDate, filter);
  }

  const onEndEditing = () => {
    if (isNumeric(searchText)) {
      if (searchText.length !== 6) {
        ToastAndroid.show('Not a valid OTP', ToastAndroid.SHORT);
        return;
      }
      setUser(searchText, parseInt(searchText), LOCATION.PIN);
    } else {
      const location = suggestions.find(
        location => location.district_name === searchText,
      );
      if (!location) {
        ToastAndroid.show(
          'No districts found for name\nPlease choose from suggestions',
          ToastAndroid.SHORT,
        );
        return;
      }
      setUser(location.district_name, location.district_id, LOCATION.DISTRICT);
    }
  };

  const setDate = (date: string) => {
    setSelectedDate(date);
    setUserData({ filter: { ...userData.filter, date } });
    setQueryDate(getQueryDate(date));
  };

  const onPressAutocompleteItem = ({ code, name }) => {
    setSearchText(name);
    setUser(name, code, LOCATION.DISTRICT);
  };

  const onPressFilter = () => {
    Animated.spring(filterAnim, {
      toValue: isFilterPressed ? 0 : FILTER_COMPONENT_SIZE,
      useNativeDriver: true,
    }).start();

    setIsFilterPressed(!isFilterPressed);
  };

  const setFilterAndCloseSection = (filter: Filter) => {
    setFilter(filter);
    setUserData({ filter: { ...userData.filter, ...filter } });
    onPressFilter();
  };
  const onChangeFocus = () => {
    setIsSearching(!isSearching);
  };
  // Not including location and date
  let filterCount = -2;
  for (const f in filter) {
    filterCount += filter[f] ? 1 : 0;
  }
  return (
    <SafeAreaView style={styles.parent}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.parent.backgroundColor}
      />
      <VtHeader title={translations.HOME_SCREEN_TITLE}>
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
            {translations.FILTER_TEXT}
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
          filterAnim={filterAnim}
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
            placeholder={translations.HOME_SEARCH_TEXT}
            placeholderTextColor={styles.placeholder.color}
            onFocus={onChangeFocus}
            onEndEditing={onChangeFocus}
            onSubmitEditing={onEndEditing}
          />
          <Pressable onPress={getLocation}>
            <Icon
              name="locate-outline"
              size={18}
              style={styles.locationIconStyle}
            />
          </Pressable>
        </View>

        {isSearching ? (
          <AutocompleteHelper
            suggestions={suggestions}
            onPress={onPressAutocompleteItem}
          />
        ) : (
          <CalendarWeek selectedDate={selectedDate} setSelectedDate={setDate} />
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;
