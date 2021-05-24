import { useNavigation } from '@react-navigation/core';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
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
import { findByDistrict } from '../../../services';
import { getDate, getQueryDate, getUsDateFromIn } from '../../../services/date';
import { Center, Session } from '../../../services/models/centers';
import { STATES_WITH_DISTRICTS } from '../../../services/models/districts';
import useBackgroundFetch from '../../../services/useBackgroundFetch';
import ErrorView from '../../common/error';
import VtHeader from '../../common/header';
import NoDataView from '../../common/no-data';
import useStyle from './styles';

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
                { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT_LIGHT },
              ]}>
              {session.available_capacity}
            </Text>
            <Text
              style={[
                styles.hospitalAvailableText,
                { color: !bookable ? colors.TEXT_DISABLED : colors.TEXT_LIGHT },
              ]}>
              available
            </Text>
            <Text
              style={styles.hospitalMinAge}>{`>${session.min_age_limit}`}</Text>
            <Text style={styles.hospitalYrsText}>yrs</Text>
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
  district,
  refetch,
  scrollY,
}: {
  centersForSelectedDate: Center[];
  district: string;
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
      ListHeaderComponent={() => (
        <Text style={styles.district}>{district}</Text>
      )}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingTop: 150 }}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          onRefresh={refetch}
          refreshing={false}
          progressViewOffset={150}
        />
      }
    />
  );
};

const Home = () => {
  const styles = useStyle();
  useBackgroundFetch();
  const scrollY = useRef(new Animated.Value(0)).current;
  // const { getPersistedData, setPersistedData } = useQueryStore();
  const [searchText, setSearchText] = useState('');
  const [queryCode, setQueryCode] = useState({
    district: 'New Delhi',
    code: 140,
  });
  const [selectedDate, setSelectedDate] = useState(getDate());
  const [queryDate, setQueryDate] = useState(getQueryDate(selectedDate));

  const {
    data,
    error,
    refetch,
    isFetching,
    isFetched,
    isLoading,
    isError,
  } = useQuery(
    ['Home', queryCode.code, queryDate],
    () => findByDistrict(queryCode.code.toString(), queryDate, true),
    {
      onSuccess: data => {
        // setPersistedData(['Home', queryCode.code, selectedDate], data);
      },
      // initialData: getPersistedData(['Home', queryCode.code, selectedDate]),
    },
  );

  const centersForSelectedDate = data?.centers?.filter(
    center =>
      center.sessions.filter(session => session.date === selectedDate).length >
      0,
  );
  const onPressFilter = () => {
    // Make the filter dropdown
  };

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
    const districtCode = findDistrictCodeByName(searchText);
    if (districtCode !== -1) {
      setQueryCode({ district: searchText, code: districtCode });
    } else {
      ToastAndroid.show(
        'No districts found for name, please try again',
        ToastAndroid.SHORT,
      );
    }
  };

  const setDate = (date: string) => {
    setSelectedDate(date);
    setQueryDate(getQueryDate(date));
  };

  return (
    <SafeAreaView style={styles.parent}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.parent.backgroundColor}
      />
      <VtHeader title={strings.dashboard.home.header}>
        <Pressable onPress={onPressFilter}>
          <Icon
            name="options"
            color={styles.iconStyle.color}
            size={24}
            style={styles.iconStyle}
          />
        </Pressable>
      </VtHeader>
      <Animated.View
        style={{
          position: 'absolute',
          backgroundColor: 'white',
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
        <View style={styles.searchParent}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            style={styles.search}
            placeholder={strings.dashboard.home.search}
            placeholderTextColor={styles.placeholder.color}
            onEndEditing={onEndEditing}
          />
        </View>
        <CalendarWeek selectedDate={selectedDate} setSelectedDate={setDate} />
      </Animated.View>

      {isError ? (
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
          district={queryCode.district}
          refetch={refetch}
          scrollY={scrollY}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
