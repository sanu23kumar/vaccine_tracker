import {useNavigation} from '@react-navigation/core';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import strings from '../../../assets/strings';
import {
  Center,
  CentersResponseModel,
  Session,
} from '../../../services/centers/model';
import {getDate} from '../../../services/date';
import useBackgroundFetch from '../../../services/useBackgroundFetch';
import useVtFetch from '../../../services/useVtFetch';
import {UserContext} from '../../../store/user';
import ErrorView from '../../common/error';
import VtHeader from '../../common/header';
import NoDataView from '../../common/no-data';
import useStyle from './styles';

const Home = () => {
  const styles = useStyle();
  const scrollY = useRef(new Animated.Value(0)).current;
  const ref = useRef<FlatList<any>>('');
  const {navigate} = useNavigation();
  useBackgroundFetch();
  const {
    data: {postalCode},
  } = useContext(UserContext);
  const [pin, setPin] = useState(postalCode);
  const [apiCode, setApiCode] = useState(postalCode);

  const {
    data,
    error,
    refetch,
    isFetching,
    isFetched,
    isLoading,
    isError,
  } = useVtFetch<CentersResponseModel>(
    [apiCode, 'Home'],
    `/v2/appointment/sessions/public/calendarByPin?pincode=${apiCode}&date=${getDate()}`,
  );

  useEffect(() => {
    if (isFetched && ref?.current?.scrollToOffset) {
      setTimeout(() => {
        ref.current?.scrollToOffset({offset: 80});
      }, 500);
    }
  }, [isFetched]);

  useEffect(() => {
    setPin(postalCode);
    setApiCode(postalCode);
  }, [postalCode]);

  const onPressNotifications = () => {
    navigate(strings.dashboard.notifications.NAME);
  };
  const renderSessions = ({item}: {item: Session}) => {
    return (
      <View style={styles.sessionParent}>
        <Text style={styles.sessionDate}>{item.date}</Text>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={
              styles.sessionCapacity
            }>{`Capacity: ${item.available_capacity}`}</Text>
          <Text
            style={styles.sessionAgeLimit}>{`>${item.min_age_limit} yr`}</Text>
        </View>
      </View>
    );
  };
  const renderItem = ({item}: {item: Center}) => {
    return (
      <View style={styles.card}>
        <View style={styles.hospitalParent}>
          <View style={styles.hospitalHeader}>
            <Text style={styles.hospitalName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.hospitalFeeType}>{item.fee_type}</Text>
          </View>
          <Text style={styles.hospitalAddress}>{item.address}</Text>
          <Text style={styles.sessionsText}>Sessions: </Text>
        </View>
        {item.sessions && (
          <FlatList
            data={item.sessions}
            renderItem={renderSessions}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.session_id}
            horizontal={true}
            ItemSeparatorComponent={() => <View style={{width: 12}} />}
            ListHeaderComponent={<View style={{width: 12}} />}
            ListFooterComponent={<View style={{width: 12}} />}
          />
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.parent}>
      <VtHeader title={strings.dashboard.home.header}>
        <Pressable onPress={onPressNotifications}>
          <Icon
            name="notifications"
            color={styles.iconStyle.color}
            size={24}
            style={styles.iconStyle}
          />
        </Pressable>
      </VtHeader>
      <Animated.View
        style={[
          styles.pinParent,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 80],
                  outputRange: [0, -80],
                }),
              },
            ],
          },
        ]}>
        <Text style={styles.differentLocationText}>
          Search for a different location:
        </Text>
        <TextInput
          style={styles.pinInput}
          value={pin}
          onChangeText={setPin}
          placeholder="000000"
          onEndEditing={() => {
            setApiCode(pin);
          }}
          keyboardType="numeric"
        />
      </Animated.View>
      {isError ? (
        <ErrorView />
      ) : isLoading ? (
        <View style={styles.noDataParent}>
          <ActivityIndicator
            size={'large'}
            animating
            color={styles.noDataText.color}
          />
        </View>
      ) : data?.centers?.length > 0 ? (
        <Animated.FlatList
          data={data.centers}
          ref={ref}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true},
          )}
          onScrollToIndexFailed={() => {
            console.log('Failed to scroll to index');
          }}
          style={styles.list}
          renderItem={renderItem}
          keyExtractor={item => item.center_id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{height: 12}} />}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              progressViewOffset={80}
            />
          }
        />
      ) : (
        <NoDataView />
      )}
    </SafeAreaView>
  );
};

export default Home;
