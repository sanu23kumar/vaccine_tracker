import React, { ReactNode } from 'react';
import { Animated, RefreshControl } from 'react-native';
import { Center } from '../../../services/models/centers';
import HospitalCard from './HospitalCard';
import useStyle from './styles';

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
      contentContainerStyle={{ paddingTop: 140 }}
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

export default List;
