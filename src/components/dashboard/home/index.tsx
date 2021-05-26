import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import { WeekCalendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import { useQuery } from 'react-query';
import fonts from '../../../assets/fonts';
import strings from '../../../assets/strings';
import useVtTheme from '../../../assets/theme/useVtTheme';
import {
  filterCenters,
  findByDistrict,
  findCalendarByPin,
  suggestDistricts,
} from '../../../services';
import { getDate, getQueryDate, getUsDateFromIn } from '../../../services/date';
import useLocation from '../../../services/location/useLocation';
import { Center, Session } from '../../../services/models/centers';
import {
  STATES_WITH_DISTRICTS,
  SuggestDistrictResponse,
} from '../../../services/models/districts';
import {
  LOCATION_TYPE_DISTRICT,
  LOCATION_TYPE_PIN,
} from '../../../services/models/user';
import { useUserStore } from '../../../services/stores';
import useBackgroundFetch from '../../../services/useBackgroundFetch';
import ErrorView from '../../common/error';
import VtHeader from '../../common/header';
import NoDataView from '../../common/no-data';
import useStyle from './styles';

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}
const CalendarWeek = ({ selectedDate, setSelectedDate }) => {
  const styles = useStyle();

  return (
    <WeekCalendar
      markedDates={{
        [getUsDateFromIn(selectedDate)]: {
          selected: true,
        },
      }}
      onDayPress={date => {
        setSelectedDate(getUsDateFromIn(date.dateString));
      }}
      theme={{
        selectedDayBackgroundColor: styles.parent.backgroundColor,
        dayTextColor: styles.placeholder.color,
        textDayFontFamily: fonts.REGULAR,
        textDayHeaderFontFamily: fonts.MEDIUM,
        textMonthFontFamily: fonts.MEDIUM,
        dotColor: styles.selectedDayStyle.color,
        todayTextColor: styles.placeholder.color,
        'stylesheet.expandable.main': {
          containerShadow: styles.containerShadow,
          dayHeader: styles.dayHeader,
        },
        'stylesheet.day.basic': {
          selectedText: styles.selectedDayStyle,
        },
      }}
    />
  );
};

const HospitalCard = ({
  hospital,
  session,
}: {
  hospital: Center;
  session: Session;
}) => {
  const styles = useStyle();
  const { colors } = useVtTheme();
  const { navigate } = useNavigation();

  const bookable = session.available_capacity > 0;

  const onPress = () => {
    if (bookable) {
      Linking.openURL('https://selfregistration.cowin.gov.in/');
    } else {
      navigate(strings.dashboard.notifications.NAME);
    }
  };
  return (
    <View style={styles.hospitalCard}>
      <View style={styles.hospitalContent}>
        <Text
          style={[
            styles.hospitalName,
            { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT },
          ]}>
          {hospital.name}
        </Text>
        <Text
          style={[
            styles.hospitalAddress,
            { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT_LIGHT },
          ]}>
          {hospital.address}
        </Text>
        <View style={styles.hospitalVaccineDetailsParent}>
          <View style={styles.hospitalAgeParent}>
            <Text
              style={[
                styles.hospitalAvailable,
                { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT },
              ]}>
              {session.available_capacity}
            </Text>
            <Text
              style={[
                styles.hospitalAvailableText,
                { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT },
              ]}>
              available
            </Text>
            <Text
              style={styles.hospitalMinAge}>{`${session.min_age_limit}+`}</Text>
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.hospitalVaccine,
              { color: !bookable ? colors.TEXT_DISABLED : colors.TERTIARY },
            ]}>
            {session.vaccine}
          </Text>
        </View>
        <View style={styles.hospitalActionParent}>
          <Pressable
            onPress={onPress}
            style={[
              styles.actionParent,
              { borderColor: bookable ? colors.PRIMARY : colors.SECONDARY },
            ]}>
            <Text
              style={[
                styles.actionText,
                { color: bookable ? colors.PRIMARY : colors.SECONDARY },
              ]}>
              {bookable
                ? `Book now for ${
                    hospital.fee_type.toLowerCase().includes('free')
                      ? 'free'
                      : '₹' + hospital.vaccine_fees[0]?.fee ?? 0
                  }`
                : 'Notify Me'}
            </Text>
          </Pressable>
          {/* {!bookable ? null : (
            <Text
              style={[
                styles.hospitalFeeType,
                {
                  color: hospital.fee_type.toLowerCase().includes('free')
                    ? colors.PRIMARY
                    : colors.SECONDARY,
                },
              ]}>
              {hospital.fee_type}
            </Text>
          )} */}
        </View>
      </View>
    </View>
  );
};

const List = ({
  centersForSelectedDate,
  refetch,
  scrollY,
}: {
  centersForSelectedDate: Center[];
  refetch: () => void;
  scrollY: Animated.Value;
}) => {
  const styles = useStyle();
  const listData = centersForSelectedDate.sort(
    (a, b) =>
      b.sessions[0].available_capacity - a.sessions[0].available_capacity,
  );
  const renderItem = ({ item }: { item: Center }) => (
    <HospitalCard hospital={item} session={item.sessions[0]} />
  );
  return (
    <Animated.FlatList
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true },
      )}
      data={listData}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingTop: 180 }}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          onRefresh={refetch}
          refreshing={false}
          progressViewOffset={150}
          progressBackgroundColor={styles.parent.backgroundColor}
          colors={[styles.selectedDayStyle.color]}
        />
      }
    />
  );
};

const AutocompleteHelper = ({
  suggestions,
  onPress,
}: {
  suggestions: SuggestDistrictResponse[];
  onPress: ({ code, name }) => void;
}) => {
  const renderItem = ({ item }: { item: SuggestDistrictResponse }) => {
    const onItemPress = () => {
      onPress({ code: item.district_id, name: item.district_name });
    };
    return (
      <Pressable onPress={onItemPress}>
        <Text>{item.district_name}</Text>
      </Pressable>
    );
  };
  return <FlatList data={suggestions.slice(0, 5)} renderItem={renderItem} />;
};

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
  const [filter, setFilter] = useState({ vaccine: '', min_age_limit: '' });
  const { data: userData, setData: setUserData } = useUserStore();
  const [searchText, setSearchText] = useState(userData.location.name);
  const [queryCode, setQueryCode] = useState(userData.location);
  const [selectedDate, setSelectedDate] = useState(getDate());
  const [queryDate, setQueryDate] = useState(getQueryDate(selectedDate));

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
    centersForSelectedDate = filterCenters(data.centers, {
      session: filter,
      availability: '',
    }).filter(
      center =>
        center.sessions.filter(session => session.date === selectedDate)
          .length > 0,
    );
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
  const isSearching = queryCode.name !== searchText;

  return (
    <SafeAreaView style={styles.parent}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.parent.backgroundColor}
      />
      <VtHeader title={strings.dashboard.home.header} />
      <Animated.View
        style={{
          position: 'absolute',
          backgroundColor: styles.parent.backgroundColor,
          left: 0,
          right: 0,
          marginTop: 79,
          zIndex: 2,
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ],
        }}>
        <View>
          <View style={styles.filterParent}>
            <View style={styles.filterAge}>
              <Pressable
                onPress={() => {
                  setFilter({
                    ...filter,
                    min_age_limit: filter?.min_age_limit === '18' ? '' : '18',
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
                    min_age_limit: filter?.min_age_limit === '45' ? '' : '45',
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
            <View style={styles.filterVaccine}>
              <Pressable
                onPress={() => {
                  setFilter({
                    ...filter,
                    vaccine: filter?.vaccine === 'SPUTNIK' ? '' : 'SPUTNIK',
                  });
                }}>
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        filter?.vaccine === 'SPUTNIK'
                          ? styles.hospitalVaccine.color
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
                    vaccine:
                      filter?.vaccine === 'COVISHIELD' ? '' : 'COVISHIELD',
                  });
                }}>
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        filter?.vaccine === 'COVISHIELD'
                          ? styles.hospitalVaccine.color
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
                    vaccine:
                      filter?.vaccine === 'COVAXIN' ? undefined : 'COVAXIN',
                  });
                }}>
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        filter?.vaccine === 'COVAXIN'
                          ? styles.hospitalVaccine.color
                          : styles.filterText.color,
                    },
                  ]}>
                  COVAXINE
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.searchParent}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              style={styles.search}
              placeholder={strings.dashboard.home.search}
              placeholderTextColor={styles.placeholder.color}
              onEndEditing={onEndEditing}
            />
            <Pressable onPress={onPressLocation}>
              <Icon
                name="locate-outline"
                size={18}
                style={styles.locationIconStyle}
              />
            </Pressable>
          </View>
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
    </SafeAreaView>
  );
};

export default Home;
