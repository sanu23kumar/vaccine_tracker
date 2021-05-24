import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import { getDate, getUsDateFromIn } from '../../../services/date';
import { Session } from '../../../services/models/centers';
import { STATES_WITH_DISTRICTS } from '../../../services/models/districts';
import { useQueryStore } from '../../../services/stores';
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
        console.log(date.dateString);
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

const HospitalCard = ({ hospital }: { hospital: Session }) => {
  const styles = useStyle();
  const { colors } = useVtTheme();

  const bookable = hospital.available_capacity > 0;
  const disabledStyle = bookable ? undefined : { color: colors.TEXT_DISABLED };
  return (
    <View style={styles.hospitalCard}>
      <View style={styles.hospitalContent}>
        <Text style={[styles.hospitalName, disabledStyle]}>
          {hospital.name}
          <Text
            style={[
              styles.hospitalFeeType,
              {
                color: hospital.fee_type.toLowerCase().includes('free')
                  ? colors.PRIMARY
                  : colors.SECONDARY,
              },
              disabledStyle,
            ]}>
            {`  ${hospital.fee_type}`}
          </Text>
        </Text>
        <Text style={[styles.hospitalAddress, disabledStyle]}>
          {hospital.address}
        </Text>
        <Text
          style={[
            styles.hospitalMinAge,
            disabledStyle,
          ]}>{`>${hospital.min_age_limit} yrs`}</Text>
        <Text style={[styles.hospitalVaccine, disabledStyle]}>
          {hospital.vaccine}
        </Text>
      </View>
      <View style={styles.hospitalActionParent}>
        <Text style={styles.hospitalAvailable}>
          {hospital.available_capacity}
          <Text style={styles.hospitalAvailableText}>{` available`}</Text>
        </Text>
        <Pressable
          style={[
            styles.actionParent,
            { borderColor: bookable ? colors.PRIMARY : colors.SECONDARY },
          ]}>
          <Text
            style={[
              styles.actionText,
              { color: bookable ? colors.PRIMARY : colors.SECONDARY },
            ]}>
            {bookable ? 'Book Now!' : 'Notify Me!'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const Home = () => {
  const styles = useStyle();
  useBackgroundFetch();
  const { getPersistedData, setPersistedData } = useQueryStore('Home');
  const [searchText, setSearchText] = useState('');
  const [queryCode, setQueryCode] = useState({
    district: 'New Delhi',
    code: 140,
  });
  const [selectedDate, setSelectedDate] = useState(getDate());

  const {
    data,
    error,
    refetch,
    isFetching,
    isFetched,
    isLoading,
    isError,
  } = useQuery(
    ['Home', queryCode.code, selectedDate],
    () => findByDistrict(queryCode.code.toString(), selectedDate, false),
    {
      onSuccess: data => {
        console.log('Data ', data);
        setPersistedData(['Home', queryCode.code, selectedDate], data);
      },
      initialData: getPersistedData(['Home', queryCode.code, selectedDate]),
    },
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
          console.log('The state is:', state);
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
      <CalendarWeek
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      {isError ? (
        <ErrorView />
      ) : isLoading ? (
        <ActivityIndicator color={styles.selectedDayStyle.color} />
      ) : data?.sessions?.length < 1 ? (
        <NoDataView />
      ) : (
        <FlatList
          data={data.sessions.sort(
            (a, b) => b.available_capacity - a.available_capacity,
          )}
          ListHeaderComponent={() => (
            <Text style={styles.district}>{queryCode.district}</Text>
          )}
          contentContainerStyle={{ paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <HospitalCard hospital={item} />}
          refreshControl={
            <RefreshControl onRefresh={refetch} refreshing={false} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
