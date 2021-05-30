import React from 'react';
import { Animated, RefreshControl } from 'react-native';
import { Center } from '../../../services/models/centers';
import HospitalCard from './HospitalCard';
import useStyle from './styles';

const List = ({
  centersForSelectedDate,
  refetch,
  scrollY,
  filterAnim,
}: {
  centersForSelectedDate: Center[];
  refetch: () => void;
  scrollY: Animated.Value;
  filterAnim: Animated.Value;
}) => {
  const styles = useStyle();
  const listData = centersForSelectedDate.sort(
    (a, b) =>
      b.sessions[0].available_capacity - a.sessions[0].available_capacity,
  );
  const renderItem = ({ item, index }: { item: Center; index: number }) => (
    <HospitalCard
      hospital={item}
      session={item.sessions[0]}
      showAd={(index + 2) % 3 === 0}
    />
  );
  return (
    <Animated.FlatList
      style={{ transform: [{ translateY: filterAnim }] }}
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
