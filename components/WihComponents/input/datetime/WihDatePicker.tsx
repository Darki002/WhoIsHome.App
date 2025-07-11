import React, {useState, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, TouchableOpacity, Modal, Dimensions, Animated, Platform, View, Easing} from 'react-native';
import { WihText } from '@/components/WihComponents/display/WihText';
import { useWihTheme } from '@/components/appContexts/WihThemeProvider';
import { useTranslation } from 'react-i18next';
import Labels from '@/constants/locales/Labels';
import WihView from '@/components/WihComponents/view/WihView';
import {GestureDetector, Gesture, Directions, GestureHandlerRootView} from 'react-native-gesture-handler';
import {formatDate} from "@/helper/datetimehelper";
import {runOnJS} from "react-native-reanimated";

export interface WihDatePickerProps {
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WihDatePicker = ({ value, onChange, disabled = false }: WihDatePickerProps) => {
  const theme = useWihTheme();
  const { t } = useTranslation();

  const [visible, setVisible] = useState<boolean>(false);
  const [animation] = useState(new Animated.Value(0));
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());

  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());
  const [prevMonth, setPrevMonth] = useState<Date>(value ? new Date(value.getFullYear(), value.getMonth() - 1, 1) : new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const [nextMonth, setNextMonth] = useState<Date>(value ? new Date(value.getFullYear(), value.getMonth() + 1, 1) : new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(new Date(value.getFullYear(), value.getMonth(), 1));
      setPrevMonth(new Date(value.getFullYear(), value.getMonth() - 1, 1));
      setNextMonth(new Date(value.getFullYear(), value.getMonth() + 1, 1));
    }
  }, [value]);

  // Handle animation
  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

  const handleOpen = () => {
    if (!disabled) {
      setVisible(true);
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleConfirm = () => {
    onChange(selectedDate);
    handleClose();
  };

  const handleCancel = () => {
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(new Date(value.getFullYear(), value.getMonth(), 1));
      setPrevMonth(new Date(value.getFullYear(), value.getMonth() - 1, 1));
      setNextMonth(new Date(value.getFullYear(), value.getMonth() + 1, 1));
    }
    handleClose();
  };

  const goToPreviousMonth = () => {
    translateX.setValue(-width);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setCurrentMonth(p => new Date(p.getFullYear(), p.getMonth() - 1, 1));
      setPrevMonth(p => new Date(p.getFullYear(), p.getMonth() - 1, 1));
      setNextMonth(p => new Date(p.getFullYear(), p.getMonth() - 1, 1));
      translateX.setValue(-width);
    });
  };

  const goToNextMonth = () => {
    translateX.setValue(-width);
    Animated.timing(translateX, {
      toValue: -2 * width,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setCurrentMonth(p => new Date(p.getFullYear(), p.getMonth() + 1, 1));
      setPrevMonth(p => new Date(p.getFullYear(), p.getMonth() + 1, 1));
      setNextMonth(p => new Date(p.getFullYear(), p.getMonth() + 1, 1));
      translateX.setValue(-width);
    });
  };

  const flingRight = useMemo(() =>
      Gesture.Fling()
          .direction(Directions.RIGHT)
          .onEnd(_ => runOnJS(goToPreviousMonth)()), []);

  const flingLeft = useMemo(() =>
      Gesture.Fling()
          .direction(Directions.LEFT)
          .onEnd(_ => runOnJS(goToNextMonth)()), []);

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setPrevMonth(new Date(today.getFullYear(), today.getMonth() - 1, 1));
    setNextMonth(new Date(today.getFullYear(), today.getMonth() + 1, 1));
  };

  const formattedDate = value ? formatDate(value) : t(Labels.placeholders.selectDate);

  const modalTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
  };


  const MonthView = ({ month }: { month: Date }) => {
    const calendar = generateCalendar(month);

    return (
        <WihView style={{width: width}}>
          {calendar.map((week, weekIndex) => (
              <WihView key={weekIndex} style={styles.weekContainer}>
                {week.map((day, dayIndex) => (
                    <TouchableOpacity
                        key={dayIndex}
                        style={[
                          styles.dayContainer,
                          day && isSelected(day) && { backgroundColor: theme.primary },
                          day && isToday(day) && !isSelected(day) && {
                            borderColor: theme.primary,
                            borderWidth: 1
                          },
                        ]}
                        onPress={() => day && setSelectedDate(day)}
                        disabled={!day}
                    >
                      {day && (
                          <WihText
                              style={[
                                styles.dayText,
                                { color: isSelected(day) ? theme.buttonText : theme.text },
                              ]}
                          >
                            {day.getDate()}
                          </WihText>
                      )}
                    </TouchableOpacity>
                ))}
              </WihView>
          ))}
        </WihView>
    )
  }

  return (
      <>
        <TouchableOpacity
            onPress={handleOpen}
            disabled={disabled}
            style={[
              styles.container,
              {
                backgroundColor: disabled ? theme.backgroundDisabled : theme.background,
                borderColor: theme.primary,
              },
            ]}
        >
          <WihText
              style={{
                color: disabled ? theme.textDisabled : theme.text,
                fontWeight: '500',
              }}
          >
            {formattedDate}
          </WihText>
        </TouchableOpacity>

        <Modal visible={visible} transparent animationType="none">
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.modalContainer}>
              <Animated.View
                  style={[
                    styles.backdrop,
                    {
                      backgroundColor: 'black',
                      opacity: backdropOpacity,
                    },
                  ]}
              >
                <TouchableOpacity
                    style={styles.backdropTouchable}
                    onPress={handleCancel}
                    activeOpacity={1}
                />
              </Animated.View>

              <Animated.View
                  style={[
                    styles.modalContent,
                    {
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.cardBorder,
                      transform: [{ translateY: modalTranslateY }],
                    },
                  ]}
              >
                <WihView style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
                  <WihText style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>
                    {t('Select Date')}
                  </WihText>
                </WihView>

                <WihView style={styles.calendarHeader}>
                  <TouchableOpacity
                      style={[styles.navButton, { backgroundColor: theme.primary }]}
                      onPress={goToPreviousMonth}
                  >
                    <WihText style={{ color: theme.buttonText }}>{'<'}</WihText>
                  </TouchableOpacity>

                  <WihText style={{ color: theme.text, fontSize: 16, fontWeight: 'bold' }}>
                    {`${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
                  </WihText>

                  <TouchableOpacity
                      style={[styles.navButton, { backgroundColor: theme.primary }]}
                      onPress={goToNextMonth}
                  >
                    <WihText style={{ color: theme.buttonText }}>{'>'}</WihText>
                  </TouchableOpacity>
                </WihView>

                <WihView style={[styles.weekdaysContainer, { borderBottomColor: theme.cardBorder }]}>
                  {weekdays.map((day, index) => (
                      <WihText
                          key={index}
                          style={[
                            styles.weekday,
                            { color: index === 0 || index === 6 ? theme.error : theme.text }
                          ]}
                      >
                        {day}
                      </WihText>
                  ))}
                </WihView>

                <GestureDetector gesture={Gesture.Race(flingRight, flingLeft)}>
                    <Animated.View style={[styles.calendarContainer, { transform: [{translateX}]}]}>
                        <MonthView month={prevMonth} />
                        <MonthView month={currentMonth} />
                        <MonthView month={nextMonth} />
                    </Animated.View>
                </GestureDetector>

                <WihView style={styles.todayButtonContainer}>
                  <TouchableOpacity
                      style={[styles.todayButton, { backgroundColor: theme.secondary }]}
                      onPress={goToToday}
                  >
                    <WihText style={{ color: theme.buttonText }}>Today</WihText>
                  </TouchableOpacity>
                </WihView>

                <WihView style={styles.footer}>
                  <TouchableOpacity
                      style={[styles.button, { backgroundColor: theme.backgroundDisabled }]}
                      onPress={handleCancel}
                  >
                    <WihText style={{ color: theme.text }}>{t(Labels.actions.cancel)}</WihText>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[styles.button, { backgroundColor: theme.primary }]}
                      onPress={handleConfirm}
                  >
                    <WihText style={{ color: theme.buttonText }}>{t(Labels.actions.confirm)}</WihText>
                  </TouchableOpacity>
                </WihView>
              </Animated.View>
            </View>
          </GestureHandlerRootView>
        </Modal>
      </>
  );
};


const generateCalendar = (currentMonth: Date) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and how many days in month
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get day of week of first day (0 = Sunday, 1 = Monday, etc.)
  let firstDayOfWeek = firstDayOfMonth.getDay();

  // Generate days array
  const days: (Date | null)[] = [];

  // Add empty slots for days before first day of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Split into weeks
  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  days.forEach((day, index) => {
    week.push(day);
    if (week.length === 7 || index === days.length - 1) {
      // Fill remaining days of last week with null
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
      week = [];
    }
  });

  return weeks;
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    minWidth: 120,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    width: width,
    maxHeight: height * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  weekday: {
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  calendarContainer: {
    flexDirection: "row",
    width: width * 3
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  dayContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    margin: 1,
  },
  dayText: {
    fontSize: 16,
  },
  todayButtonContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  todayButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
});