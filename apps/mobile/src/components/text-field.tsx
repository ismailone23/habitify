import { defaultBorderRadius, defaultSpacing } from "@/constants/theme";
import { useColors } from "@/hooks/useColor";
import React, { forwardRef, useState } from "react";
import { TextInput, TextInputProps } from "react-native";

export type TextFieldProps = TextInputProps;

const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ style, onFocus, onBlur, ...props }, ref) => {
    const colors = useColors();
    const [focused, setFocused] = useState(false);

    return (
      <TextInput
        style={[
          {
            borderWidth: 2,
            borderColor: focused ? colors.primary : colors.border,
            borderRadius: defaultBorderRadius,
            paddingHorizontal: defaultSpacing * 0.75,
            paddingVertical: defaultSpacing * 0.75,
            backgroundColor: colors.secondary,
            color: colors.foreground,
          },
          style,
        ]}
        placeholderTextColor={colors.placeholder}
        cursorColor={colors.primary}
        selectionColor={colors.primary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        ref={ref}
        {...props}
      />
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
