import React from 'react';
import { WeekCalendar } from 'react-native-calendars';
import fonts from '../../../assets/fonts';
import { getUsDateFromIn } from '../../../services/date';
import useStyle from './styles';

const CalendarWeek = ({ current, selectedDate, setSelectedDate }) => {
  const styles = useStyle();
  return (
    <WeekCalendar
      current={getUsDateFromIn(current)}
      markedDates={{
        [getUsDateFromIn(selectedDate)]: {
          selected: true,
        },
      }}
      onDayPress={date => {
        setSelectedDate(getUsDateFromIn(date.dateString));
      }}
      style={{ backgroundColor: styles.parent.backgroundColor }}
      theme={{
        selectedDayBackgroundColor: styles.parent.backgroundColor,
        dayTextColor: styles.placeholder.color,
        textDayFontFamily: fonts.REGULAR,
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
      }}
    />
  );
};

export default CalendarWeek;
