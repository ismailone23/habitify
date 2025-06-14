import { defaultSpacing } from "@/constants/theme";
import { useColors } from "@/hooks/useColor";
import React, { forwardRef, useMemo } from "react";
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from "react-native";

export type ButtonProps = TouchableHighlightProps & {
  variant?: "primary" | "outline" | "secondary";
  textStyle?: StyleProp<TextStyle>;
};

const Button = forwardRef<View, ButtonProps>(
  (
    { children, variant = "primary", style, textStyle, underlayColor, ...rest },
    ref
  ) => {
    const colors = useColors();

    const variantStyle = useMemo((): StyleProp<ViewStyle> => {
      if (variant === "primary") {
        return [
          {
            backgroundColor: colors.primary,
          },
        ];
      } else if (variant === "outline") {
        return [
          {
            borderWidth: 1,
            borderColor: colors.border,
          },
        ];
      } else if (variant === "secondary") {
        return [
          {
            backgroundColor: colors.secondary,
          },
        ];
      } else {
        return [];
      }
    }, [colors.border, colors.secondary, colors.primary, variant]);

    return (
      <TouchableHighlight
        style={[
          {
            height: 40,
            borderRadius: 999,
            paddingHorizontal: defaultSpacing,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          },
          variantStyle,
          style,
        ]}
        underlayColor={
          (underlayColor ?? variant === "primary")
            ? colors.primaryUnderlayColor
            : variant === "secondary"
              ? colors.secondaryUnderlayColor
              : colors.secondary
        }
        {...rest}
        ref={ref}
      >
        <Text
          style={[
            {
              fontSize: 13,
              fontWeight: "600",
              color:
                variant === "primary"
                  ? colors.primaryForeground
                  : colors.foreground,
              textAlign: "center",
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      </TouchableHighlight>
    );
  }
);

Button.displayName = "Button";

export default Button;
