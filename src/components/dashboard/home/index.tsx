import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
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
import { findByDistrict } from '../../../services';
import { getDate, getUsDateFromIn } from '../../../services/date';
import { Session } from '../../../services/models/centers';
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
        console.log(date.dateString);
        setSelectedDate(date.dateString);
      }}
      theme={{
        selectedDayBackgroundColor: styles.parent.backgroundColor,
        selectedDayTextColor: styles.selectedDayStyle.color,
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
      }}
    />
  );
};

const HospitalCard = ({ hospital }: { hospital: Session }) => {
  const styles = useStyle();
  return (
    <View>
      <Text>{hospital.name}</Text>
    </View>
  );
};

const Home = () => {
  const styles = useStyle();
  useBackgroundFetch();
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
      },
    },
  );

  console.log('selectedDate', selectedDate);

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
        <Icon
          name="locate-outline"
          color={styles.locationIconStyle.color}
          size={18}
          style={styles.locationIconStyle}
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
          data={data.sessions}
          renderItem={({ item }) => <HospitalCard hospital={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
