import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, Animated, Platform } from 'react-native';
import { WihText } from '@/components/WihComponents/display/WihText';
import { useWihTheme } from '@/components/appContexts/WihThemeProvider';
import { useTranslation } from 'react-i18next';
import Labels from '@/constants/locales/Labels';
import WihView from '@/components/WihComponents/view/WihView';
import { WihTextInput } from '@/components/WihComponents/input/WihTextInput';

export interface WihTimePickerProps {
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export const WihTimePicker = ({ value, onChange, disabled = false }: WihTimePickerProps) => {
  const theme = useWihTheme();
  const { t } = useTranslation();
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };
  
  const [visible, setVisible] = useState<boolean>(false);
  const [hours, setHours] = useState<number>(value ? value.getHours() : 18);
  const [minutes, setMinutes] = useState<number>(value ? value.getMinutes() : 0);
  const [hoursInput, setHoursInput] = useState<string>(value ? formatNumber(value.getHours()) : '18');
  const [minutesInput, setMinutesInput] = useState<string>(value ? formatNumber(value.getMinutes()) : '00');
  const [animation] = useState(new Animated.Value(0));
  // Track which field should have focus
  const [focusMinutes, setFocusMinutes] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      setHours(value.getHours());
      setMinutes(value.getMinutes());
      setHoursInput(formatNumber(value.getHours()));
      setMinutesInput(formatNumber(value.getMinutes()));
    }
  }, [value]);

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
      
      // Reset focus state when modal is closed
      setFocusMinutes(false);
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
    const newDate = new Date();
    newDate.setHours(hours, minutes, 0, 0);
    onChange(newDate);
    handleClose();
  };

  const handleCancel = () => {
    if (value) {
      setHours(value.getHours());
      setMinutes(value.getMinutes());
    }
    handleClose();
  };

  const incrementHours = () => {
    const newHours = (hours + 1) % 24;
    setHours(newHours);
    setHoursInput(formatNumber(newHours));
  };

  const decrementHours = () => {
    const newHours = (hours - 1 + 24) % 24;
    setHours(newHours);
    setHoursInput(formatNumber(newHours));
  };

  const incrementMinutes = () => {
    const newMinutes = (minutes + 5) % 60;
    setMinutes(newMinutes);
    setMinutesInput(formatNumber(newMinutes));
  };

  const decrementMinutes = () => {
    const newMinutes = (minutes - 5 + 60) % 60;
    setMinutes(newMinutes);
    setMinutesInput(formatNumber(newMinutes));
  };
  
  const handleHoursChange = (text: string) => {
    setHoursInput(text);
    
    // Update hours state if valid
    const numValue = parseInt(text, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue < 24) {
      setHours(numValue);
    }
    
    // Auto-focus to minutes input when 2 digits are entered
    if (text.length === 2) {
      setFocusMinutes(true);
    }
  };
  
  const handleMinutesChange = (text: string) => {
    setMinutesInput(text);
    
    // Update minutes state if valid
    const numValue = parseInt(text, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue < 60) {
      setMinutes(numValue);
    }
  };
  
  const handleHoursBlur = () => {
    let numValue = parseInt(hoursInput, 10);
    if (isNaN(numValue) || numValue < 0) {
      numValue = 0;
    } else if (numValue > 23) {
      numValue = 23;
    }
    setHours(numValue);
    setHoursInput(formatNumber(numValue));
  };
  
  const handleMinutesBlur = () => {
    let numValue = parseInt(minutesInput, 10);
    if (isNaN(numValue) || numValue < 0) {
      numValue = 0;
    } else if (numValue > 59) {
      numValue = 59;
    }
    setMinutes(numValue);
    setMinutesInput(formatNumber(numValue));
  };

  const formattedTime = value
    ? value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : t(Labels.placeholders.selectTime);

  const modalTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

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
          {formattedTime}
        </WihText>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                backgroundColor: 'black',
                opacity: backdropOpacity,
              },
            ]}
            onTouchEnd={handleCancel}
          />
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
            <WihView style={styles.header}>
              <WihText style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>
                {t('Select Time')}
              </WihText>
            </WihView>

            <WihView style={styles.timePickerContainer}>
              <WihView style={styles.timeColumn}>
                <TouchableOpacity
                  style={[styles.arrowButton, { backgroundColor: theme.primary }]}
                  onPress={incrementHours}
                >
                  <WihText style={{ color: theme.buttonText, fontSize: 18 }}>▲</WihText>
                </TouchableOpacity>
                <View
                  style={[
                    styles.timeValue,
                    { backgroundColor: theme.background, borderColor: theme.border },
                  ]}
                >
                  <WihTextInput
                    style={styles.timeInput}
                    value={hoursInput}
                    onChangeText={handleHoursChange}
                    onBlur={handleHoursBlur}
                    inputMode="numeric"
                    maxLength={2}
                    selectTextOnFocus
                  />
                </View>
                <TouchableOpacity
                  style={[styles.arrowButton, { backgroundColor: theme.primary }]}
                  onPress={decrementHours}
                >
                  <WihText style={{ color: theme.buttonText, fontSize: 18 }}>▼</WihText>
                </TouchableOpacity>
              </WihView>

              <WihText style={{ color: theme.text, fontSize: 24, fontWeight: 'bold' }}>:</WihText>

              <WihView style={styles.timeColumn}>
                <TouchableOpacity
                  style={[styles.arrowButton, { backgroundColor: theme.primary }]}
                  onPress={incrementMinutes}
                >
                  <WihText style={{ color: theme.buttonText, fontSize: 18 }}>▲</WihText>
                </TouchableOpacity>
                <View
                  style={[
                    styles.timeValue,
                    { backgroundColor: theme.background, borderColor: theme.border },
                  ]}
                >
                  <WihTextInput
                    style={styles.timeInput}
                    value={minutesInput}
                    onChangeText={handleMinutesChange}
                    onBlur={handleMinutesBlur}
                    inputMode="numeric"
                    maxLength={2}
                    selectTextOnFocus
                    autoFocus={focusMinutes}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.arrowButton, { backgroundColor: theme.primary }]}
                  onPress={decrementMinutes}
                >
                  <WihText style={{ color: theme.buttonText, fontSize: 18 }}>▼</WihText>
                </TouchableOpacity>
              </WihView>
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
      </Modal>
    </>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    minWidth: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  timeColumn: {
    alignItems: 'center',
    gap: 10,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValue: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  timeInput: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
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
