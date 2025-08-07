import React, {useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import { WihText } from '@/components/WihComponents/display/WihText';
import { useWihTheme } from '@/components/appContexts/WihThemeProvider';
import {DatePicker, DatePickerHandle, Options, Styles} from "@s77rt/react-native-date-picker";
import {formatDate} from "@/helper/datetimehelper";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";

export interface WihDatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
}

export const WihDatePicker = ({ value, onChange, disabled = false }: WihDatePickerProps) => {
  const theme = useWihTheme();
  const { t } = useTranslation();

  const datePicker  = useRef<DatePickerHandle>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        onChange(date);
    };

    const options = useMemo<Options>(() =>({
      confirmText: t(Labels.actions.confirm),
      cancelText: t(Labels.actions.cancel),
    }), [t]);

    const datePickerStyles = useMemo<Styles>(() => ({
      containerColor: theme.background,
      selectorColor: theme.primary,
    }), [theme]);

  const formattedDate = value ? formatDate(value) : t(Labels.placeholders.selectDate);
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
            {formattedDate}
          </WihText>
        </TouchableOpacity>


        <DatePicker
            ref={datePicker}
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
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
    minWidth: 120,
  },
});