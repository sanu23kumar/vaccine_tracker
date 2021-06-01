import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SuggestDistrictResponse } from '../../../services/models/districts';
import useStyle from './styles';

const AutocompleteHelper = ({
  suggestions,
  onPress,
}: {
  suggestions: SuggestDistrictResponse[];
  onPress: ({ code, name }) => void;
}) => {
  const styles = useStyle();
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  }, []);

  const renderItem = ({ item }: { item: SuggestDistrictResponse }) => {
    const onItemPress = () => {
      onPress({ code: item.district_id, name: item.district_name });
      Keyboard.dismiss();
    };
    return (
      <Pressable style={styles.suggestionTextParent} onPress={onItemPress}>
        <Text style={styles.suggestionText}>
          {item.district_name},{' '}
          <Text style={styles.suggestionState}>{item.state_name}</Text>
        </Text>
      </Pressable>
    );
  };
  return (
    <View style={styles.autocompleteParent}>
      <Animated.View
        style={{
          opacity: fadeInAnim,
          transform: [
            {
              translateY: fadeInAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}>
        <FlatList
          data={suggestions.slice(0, 5)}
          renderItem={renderItem}
          keyboardShouldPersistTaps="always"
        />
      </Animated.View>
    </View>
  );
};

export default AutocompleteHelper;
