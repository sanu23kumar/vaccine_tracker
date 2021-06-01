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
import { suggestDistricts } from '../../../services';
import { getDate } from '../../../services/date';
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
  const [date, setDate] = useState(new Date());
  const { districtsData } = useDistrictsStore();
  const { data: userData, setData: setUserData } = useUserStore();
  const [searchText, setSearchText] = useState(userData.location.name);
  const [isSearching, setIsSearching] = useState(false);
  const [isChangingTitle, setIsChangingTitle] = useState(false);
  const [titleText, setTitleText] = useState(
    searchText + ', ' + getDate(date).substr(0, 5),
  );
  const [queryCode, setQueryCode] = useState(userData.location);
  const [filterLocal, setFilterLocal] = useState<NotificationFilter>(
    filter ?? userData.filter ?? {},
  );
  const suggestions = suggestDistricts(searchText, districtsData.states);
  const rewarded = RewardedAd.createForAdRequest(adUnitId);

  useEffect(() => {
    setTitleText(searchText + ', ' + getDate(date).substr(0, 5));
  }, [date, searchText]);

  useEffect(() => {
    const eventListener = rewarded.onAdEvent((type, error, reward) => {
      if (type === RewardedAdEventType.LOADED) {
        rewarded.show();
      } else if (type === RewardedAdEventType.EARNED_REWARD) {
        onSave({
          ...filterLocal,
          notification_id: new Date().getMilliseconds(),
          notification_name: titleText,
          date: getDate(date),
          enabled: true,
          location: userData.location,
        });
      }
    });
    return () => {
      eventListener();
    };
  }, []);

  const setLocalFilterHelper = (filter: NotificationFilter) => {
    setFilterLocal({
      ...filterLocal,
      ...filter,
    });
  };

  const onPressApply = () => {
    rewarded.load();
  };

  const setUser = (name: string, code: number, type: LOCATION) => {
    setQueryCode({ name, code, type });
    setUserData({ location: { name, code, type } });
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
    const currentDate = selectedDate || date;
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
    setSearchText(userData.location.name);
    setFilterLocal(userData.filter ?? {});
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
      <Text style={styles.filterSectionTitle}>
        WHEN DO YOU WISH TO GET VACCINATED
      </Text>
      <Pressable onPress={onPressDate} style={styles.searchParent}>
        <Text style={styles.search}>{getDate(date)}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      <Text style={styles.filterSectionTitle}>DISTRICT/PIN CODE</Text>
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
      <Text style={styles.filterSectionTitle}>NOTIFICATION TITLE</Text>
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
        <Text style={styles.filterApply}>Save</Text>
      </Pressable>
    </Animated.View>
  );
};

export default NewHelper;
