import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  View
} from 'react-native';
import useVtFetch from '../../../services/useVtFetch';
import { UserContext } from '../../../store/user';
import { Center, Session, VaccineResponseModel } from './model';
import useStyle from './styles';

const Home = () => {
  const styles = useStyle();
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
    isLoading,
    isError,
  } = useVtFetch<VaccineResponseModel>(
    [apiCode, 'Home'],
    `/v2/appointment/sessions/public/calendarByPin?pincode=${pin}&date=05-05-2021`,
  );

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
      <View style={styles.hospitalParent}>
        <View style={styles.hospitalHeader}>
          <Text style={styles.hospitalName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.hospitalFeeType}>{item.fee_type}</Text>
        </View>
        <Text style={styles.hospitalAddress}>{item.address}</Text>
        <Text style={styles.sessionsText}>Sessions: </Text>
        {item.sessions && (
          <FlatList
            data={item.sessions}
            renderItem={renderSessions}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.session_id}
            horizontal={true}
            ItemSeparatorComponent={() => <View style={{width: 6}} />}
          />
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.pinParent}>
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
      </View>
      {isLoading ? (
        <View style={styles.noDataParent}>
          <ActivityIndicator size={'large'} animating />
        </View>
      ): null}
      {isError ? (
        <View style={styles.noDataParent}>
          <Text>Something went wrong</Text>
          <Text>{error}</Text>
        </View>
      ): null}
      {data?.centers?.length > 0 ? (
        <FlatList
          data={data.centers}
          renderItem={renderItem}
          keyExtractor={item => item.center_id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{height: 12}} />}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        />
      ) : (
        <View style={styles.noDataParent}>
          <Text style={styles.noDataText}>No centers found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
