import React from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native";

import { useColors } from "@/hooks/useColor";

interface FormInputProps extends TextInputProps {
  name: string;
  label: string;
  control: Control<any>;
  rules?: object;
}

export default function FormInput({
  name,
  label,
  control,
  rules = {},
  ...rest
}: FormInputProps) {
  const colors = useColors();
  return (
    <View>
      <Text
        style={{
          fontSize: 15,
          fontFamily: "Roboto",
          fontWeight: 700,
          color: colors.foreground,
        }}
      >
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 6,
                paddingHorizontal: 8,
                color: colors.foreground,
                height: 40,
                borderColor: error ? colors.destructive : colors.border,
              }}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              {...rest}
            />
            {error && (
              <Text style={{ color: colors.destructive }}>{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
}
