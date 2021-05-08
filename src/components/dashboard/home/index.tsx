import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, Text, TextInput, View } from 'react-native';
import { useQuery } from 'react-query';
import useLocation from '../useLocation';
import { initialData } from './initialData';
import { Center, Session, VaccineResponseModel } from './model';
import useStyle from './styles';

const Home = () => {
  const styles = useStyle();
  const postalCode = useLocation();
  const [pin, setPin] = useState('');
  const [codeToFetch, setCodeToFetch] = useState('');
  const {data, refetch, isFetching} = useQuery<VaccineResponseModel>(
    [codeToFetch, 'Home'],
    () =>
      fetch(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${codeToFetch}&date=05-05-2021`,
      ).then(res => res.json()),
    {
      onSuccess: data => {
        console.log(JSON.stringify(data));
      },
      onError: e => {
        console.log('Error', e);
      },
      initialData: initialData,
      enabled: false,
    },
  );
  useEffect(() => {
    if (postalCode.length > 0 && pin.length === 0) setPin(postalCode);
  }, [postalCode]);
  const onEndEditing = () => {
    setCodeToFetch(pin);
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
              style={
                styles.sessionAgeLimit
              }>{`>${item.min_age_limit} yr`}</Text>
          </View>
        </View>
    );
  };
  const renderItem = ({item}: {item: Center}) => {
    return (
      <View style={styles.hospitalParent}>
        <View style={styles.hospitalHeader}>
          <Text style={styles.hospitalName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.hospitalFeeType}>{item.fee_type}</Text>
        </View>
        <Text style={styles.hospitalAddress}>{item.address}</Text>
        <Text style={styles.sessionsText}>Sessions: </Text>
        <FlatList
          data={item.sessions}
          renderItem={renderSessions}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.session_id}
          horizontal={true}
          ItemSeparatorComponent={() => <View style={{width: 6}} />}
        />
      </View>
    );
  };
  return (
    <SafeAreaView>
      <View style={styles.pinParent}>
        <TextInput
          style={styles.pinInput}
          value={pin}
          onChangeText={setPin}
          placeholder="000000"
          onEndEditing={onEndEditing}
          keyboardType="numeric"
        />
      </View>
      <FlatList
        data={data.centers}
        renderItem={renderItem}
        keyExtractor={(item) => item.center_id.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
      />
    </SafeAreaView>
  );
};

export default Home;
