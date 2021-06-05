import useStore from 'potli/useStore';
import React, { useEffect, useState } from 'react';
import { WeekCalendar } from 'react-native-calendars';
import fonts, { fontSizes } from '../../../assets/fonts';
import { getUsDateFromIn } from '../../../services/date';
import useStyle from './styles';

const CalendarWeek = ({ current, selectedDate, setSelectedDate }) => {
  const styles = useStyle();
  const { data: userTheme, setData: setUserTheme } = useStore('THEME');
  const [distroyCalendar, setDistroyCalendar] = useState(false);
  useEffect(() => {
    setDistroyCalendar(true);
    setTimeout(() => {
      setDistroyCalendar(false);
    }, 10);
  }, [userTheme]);
  const markedDates = {
    [getUsDateFromIn(selectedDate)]: {
      selected: true,
    },
  };

  const onDayPress = date => {
    setSelectedDate(getUsDateFromIn(date.dateString));
  };

  const style = { backgroundColor: styles.parent.backgroundColor };

  const theme = {
    selectedDayBackgroundColor: styles.parent.backgroundColor,
    dayTextColor: styles.filterText.color,
    textDayFontFamily: fonts.REGULAR,
    textDayFontSize: fontSizes.CONTENT,
    textDayHeaderFontFamily: fonts.MEDIUM,
    textMonthFontFamily: fonts.MEDIUM,
    dotColor: styles.selectedDayStyle.color,
    todayTextColor: styles.placeholder.color,
    'stylesheet.expandable.main': {
      containerShadow: styles.containerShadow,
      dayHeader: styles.dayHeader,
      container: { backgroundColor: styles.parent.backgroundColor },
    },
    'stylesheet.day.basic': {
      selectedText: styles.selectedDayStyle,
    },
  };

  return distroyCalendar ? null : (
    <WeekCalendar
      current={getUsDateFromIn(current)}
      markedDates={markedDates}
      onDayPress={onDayPress}
      style={style}
      theme={theme}
    />
  );
};

export default CalendarWeek;
