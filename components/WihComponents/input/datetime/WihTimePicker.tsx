import React, {useState, useRef, useMemo} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { WihText } from '@/components/WihComponents/display/WihText';
import { useWihTheme } from '@/components/appContexts/WihThemeProvider';
import { useTranslation } from 'react-i18next';
import Labels from '@/constants/locales/Labels';
import {formatTime} from "@/helper/datetimehelper";
import {DatePicker, DatePickerHandle, Options, Styles} from "@s77rt/react-native-date-picker";

export interface WihTimePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
}

export const WihTimePicker = ({ value, onChange, disabled = false }: WihTimePickerProps) => {
  const theme = useWihTheme();
  const { t } = useTranslation();

  const datePicker  = useRef<DatePickerHandle>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(value || null);

  const handleTimeChange = (date: Date | null) => {
    setSelectedTime(date);
    onChange(date);
  };

  const options = useMemo<Options>(() =>({
    confirmText: t(Labels.actions.confirm),
    cancelText: t(Labels.actions.cancel),
    is24Hour: true,
  }), [t]);

  const datePickerStyles = useMemo<Styles>(() => ({
    containerColor: theme.background,
    selectorColor: theme.primary,
  }), [theme]);

  const formattedTime = value
    ? formatTime(value)
    : t(Labels.placeholders.selectTime);

  return (
    <>
      <TouchableOpacity
        onPress={() => datePicker.current?.showPicker()}
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

      <DatePicker
          ref={datePicker}
          type="time"
          value={selectedTime}
          onChange={handleTimeChange}
          options={options}
          styles={datePickerStyles}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    minWidth: 100,
  }
});
