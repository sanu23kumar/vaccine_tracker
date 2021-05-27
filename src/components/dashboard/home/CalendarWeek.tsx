import React from 'react';
import { WeekCalendar } from 'react-native-calendars';
import fonts from '../../../assets/fonts';
import { getUsDateFromIn } from '../../../services/date';
import useStyle from './styles';

const CalendarWeek = ({ selectedDate, setSelectedDate }) => {
  const styles = useStyle();

  return (
    <WeekCalendar
      markedDates={{
        [getUsDateFromIn(selectedDate)]: {
          selected: true,
        },
      }}
      onDayPress={date => {
        setSelectedDate(getUsDateFromIn(date.dateString));
      }}
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
        },
        'stylesheet.day.basic': {
          selectedText: styles.selectedDayStyle,
        },
      }}
    />
  );
};

export default CalendarWeek;
