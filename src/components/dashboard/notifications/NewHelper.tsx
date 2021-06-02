import DateTimePicker from '@react-native-community/datetimepicker';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import strings from '../../../assets/strings';
import translations from '../../../assets/translations';
import { suggestDistricts } from '../../../services';
import { getDate, getUsDateFromIn } from '../../../services/date';
import useLocation from '../../../services/location/useLocation';
import {
  AGE_LIMIT,
  AVAILABILITY,
  FEE_TYPE,
  VACCINE,
} from '../../../services/models/centers';
import {
  FILTER_KEYS,
  NotificationFilter,
} from '../../../services/models/filters';
import { LOCATION } from '../../../services/models/user';
import { useDistrictsStore, useUserStore } from '../../../services/stores';
import { isNumeric } from '../home';
import AutocompleteHelper from '../home/AutocompleteHelper';
import FilterType from './FilterType';
import useStyle from './styles';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-9968987511053896/3123571100';

export const HELPER_COMPONENT_SIZE = 600;

const getTitle = (filterLocal: NotificationFilter) => {
  let newTitle = '';
  if (
    filterLocal.availability &&
    filterLocal.availability !== AVAILABILITY.AVAILABLE
  ) {
    newTitle +=
      ', ' +
      filterLocal.availability
        .substr(filterLocal.availability.indexOf('dose'))
        .toUpperCase();
  }
  if (filterLocal.vaccine) {
    newTitle += ', ' + filterLocal.vaccine;
  }
  if (filterLocal.min_age_limit) {
    newTitle += ', ' + filterLocal.min_age_limit + '+';
  }
  return newTitle;
};
interface Props {
  filter?: NotificationFilter;
  onSave: (arg1: NotificationFilter) => void;
  onDelete: (arg1: NotificationFilter) => void;
  filterAnim: Animated.Value;
}
const NewHelper = ({ filter, onSave, onDelete, filterAnim }: Props) => {
  const styles = useStyle();
  const {
    postalCode,
    isLoading: isLocationLoading,
    getLocation,
  } = useLocation();
  const searchAnim = useRef(new Animated.Value(0)).current;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { districtsData } = useDistrictsStore();
  const { data: userData } = useUserStore();
  const [filterLocal, setFilterLocal] = useState<NotificationFilter>(
    filter ?? {
      ...userData.filter,
      availability: AVAILABILITY.AVAILABLE,
      date: userData.filter.date ?? getDate(),
    },
  );
  console.log('User data is: ', userData);
  const [searchText, setSearchText] = useState(filterLocal.location.name);
  const [isSearching, setIsSearching] = useState(false);
  const [date, setDate] = useState(filterLocal.date);
  const [isChangingTitle, setIsChangingTitle] = useState(false);
  const [titleText, setTitleText] = useState(
    searchText + ', ' + date.substr(0, 5) + getTitle(filterLocal),
  );
  const suggestions = suggestDistricts(searchText, districtsData.states);
  const rewarded = useRef(RewardedAd.createForAdRequest(adUnitId)).current;

  useEffect(() => {
    setTitleText(searchText + ', ' + date.substr(0, 5) + getTitle(filterLocal));
  }, [date, searchText, filterLocal]);

  useEffect(() => {
    const eventListener = rewarded.onAdEvent((type, error, reward) => {
      if (type === RewardedAdEventType.LOADED) {
        console.log('Ad loaded', type, error);
      } else if (type === RewardedAdEventType.EARNED_REWARD) {
        onSave({
          ...filterLocal,
          notification_id: new Date().getMilliseconds(),
          notification_name: titleText,
          date,
          enabled: true,
        });
      } else if (type === 'closed') {
        rewarded.load();
      } else {
        console.log('Something happened', type, error);
      }
    });
    rewarded.load();
    return () => {
      eventListener();
    };
  }, [filterLocal, date, titleText]);

  const setLocalFilterHelper = (filter: NotificationFilter) => {
    setFilterLocal({
      ...filterLocal,
      ...filter,
    });
  };
  const onPressApply = () => {
    console.log('Showing ad');
    if (rewarded.loaded) {
      rewarded.show();
    } else {
      console.log('Not loaded');
    }
  };

  const onPressDelete = () => {
    onDelete(filter);
  };

  const setUser = (name: string, code: number, type: LOCATION) => {
    setFilterLocal({ location: { name, code, type } });
  };

  const onPressAutocompleteItem = ({ code, name }) => {
    setSearchText(name);
    setUser(name, code, LOCATION.DISTRICT);
  };

  const onSubmitEditing = () => {
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
  const onChangeDate = (event, selectedDate) => {
    const currentDate = getDate(selectedDate) || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
  const onPressDate = () => {
    setShowDatePicker(true);
  };
  const onChangeFocus = () => {
    setIsSearching(!isSearching);
  };
  const onChangeTitleFocus = () => {
    setIsChangingTitle(!isChangingTitle);
  };
  useEffect(() => {
    Animated.spring(searchAnim, {
      toValue: isSearching || isChangingTitle ? -310 : 0,
      useNativeDriver: true,
    }).start();
  }, [isSearching, isChangingTitle]);

  useEffect(() => {
    if (isLocationLoading === 0 && postalCode) {
      setSearchText(postalCode);
      setUser(postalCode, parseInt(postalCode), LOCATION.PIN);
    }
  }, [isLocationLoading, postalCode]);

  useEffect(() => {
    setSearchText(userData.filter.location.name);
    setDate(userData.filter.date);
    setFilterLocal({
      ...userData.filter,
      availability: AVAILABILITY.AVAILABLE,
    });
  }, [userData]);

  return (
    <Animated.View
      style={[
        styles.filterParent,
        {
          transform: [
            {
              translateY: Animated.add(filterAnim, searchAnim),
            },
          ],
        },
      ]}>
      <Text style={styles.filterSectionTitle}>
        {translations.FILTER_VACCINE_TEXT}
      </Text>
      <View style={styles.filterSection}>
        <FilterType
          name={translations.FILTER_ALL_TEXT}
          type={FILTER_KEYS.VACCINE}
          filter={undefined}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name={translations.FILTER_VACCINE_SPUTNIK_TEXT}
          type={FILTER_KEYS.VACCINE}
          filter={VACCINE.SPUTNIK}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name={translations.FILTER_VACCINE_COVISHIELD_TEXT}
          type={FILTER_KEYS.VACCINE}
          filter={VACCINE.COVISHIELD}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name={translations.FILTER_VACCINE_COVISHIELD_TEXT}
          type={FILTER_KEYS.VACCINE}
          filter={VACCINE.COVAXIN}
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
      </View>
      <Text style={styles.filterSectionTitle}>
        {translations.FILTER_AGE_TEXT}
      </Text>
      <View style={styles.filterSection}>
        <FilterType
          name={translations.FILTER_ALL_TEXT}
          type={FILTER_KEYS.MIN_AGE_LIMIT}
          filter={undefined}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name={translations.FILTER_AGE_18_PLUS_TEXT}
          type={FILTER_KEYS.MIN_AGE_LIMIT}
          filter={AGE_LIMIT.MIN_18}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name={translations.FILTER_AGE_45_PLUS_TEXT}
          type={FILTER_KEYS.MIN_AGE_LIMIT}
          filter={AGE_LIMIT.MIN_45}
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
      </View>
      <Text style={styles.filterSectionTitle}>
        {translations.FILTER_COST_TEXT}
      </Text>
      <View style={styles.filterSection}>
        <FilterType
          name={translations.FILTER_ALL_TEXT}
          type={FILTER_KEYS.FEE_TYPE}
          filter={undefined}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name={translations.FILTER_COST_FREE_TEXT}
          type={FILTER_KEYS.FEE_TYPE}
          filter={FEE_TYPE.FREE}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name={translations.FILTER_COST_PAID_TEXT}
          type={FILTER_KEYS.FEE_TYPE}
          filter={FEE_TYPE.PAID}
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
      </View>
      <Text style={styles.filterSectionTitle}>
        {translations.FILTER_DOSE_TEXT}
      </Text>
      <View style={styles.filterSection}>
        <FilterType
          name={translations.FILTER_ANY_TEXT}
          type={FILTER_KEYS.AVAILABILITY}
          filter={AVAILABILITY.AVAILABLE}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name={translations.FILTER_DOSE_FIRST_TEXT}
          type={FILTER_KEYS.AVAILABILITY}
          filter={AVAILABILITY.DOSE_1}
          separator
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
        <FilterType
          name={translations.FILTER_DOSE_SECOND_TEXT}
          type={FILTER_KEYS.AVAILABILITY}
          filter={AVAILABILITY.DOSE_2}
          filterLocal={filterLocal}
          setLocalFilterHelper={setLocalFilterHelper}
        />
      </View>
      <Text style={styles.filterSectionTitle}>
        {translations.NOTIFICATION_DATE}
      </Text>
      <Pressable onPress={onPressDate} style={styles.searchParent}>
        <Text style={styles.search}>{date}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(getUsDateFromIn(date))}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      <Text style={styles.filterSectionTitle}>
        {translations.NOTIFICATION_LOCATION}
      </Text>
      <View style={styles.searchParent}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          onFocus={onChangeFocus}
          onEndEditing={onChangeFocus}
          style={styles.search}
          placeholder={strings.dashboard.home.search}
          placeholderTextColor={styles.placeholder.color}
          onSubmitEditing={onSubmitEditing}
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
      ) : null}
      <Text style={styles.filterSectionTitle}>
        {translations.NOTIFICATION_TITLE}
      </Text>
      <View style={styles.searchParent}>
        <TextInput
          value={titleText}
          onFocus={onChangeTitleFocus}
          onEndEditing={onChangeTitleFocus}
          onChangeText={setTitleText}
          style={styles.search}
        />
      </View>
      <Pressable style={styles.filterActionButtonApply} onPress={onPressApply}>
        <Text style={styles.filterApply}>{translations.FILTER_SAVE_TEXT}</Text>
      </Pressable>
      {!filter ? null : (
        <Pressable
          style={styles.filterActionButtonDelete}
          onPress={onPressDelete}>
          <Text style={styles.filterDelete}>
            {translations.FILTER_DELETE_TEXT}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
};

export default NewHelper;
