import { useState, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, focusScale, radii, touchTargets } from "@hypelive/design-tokens";

type Props = PressableProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  scale?: number;
};

/**
 * TV-first focusable wrapper.
 * Uses Pressable focus events; on tvOS with react-native-tvos,
 * hasTVPreferredFocus / TVFocusGuideView can wrap rows.
 */
export function Focusable({
  children,
  style,
  focusedStyle,
  scale = focusScale.default,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        styles.base,
        style,
        focused && {
          transform: [{ scale }],
          borderColor: colors.accent,
          borderWidth: 3,
        },
        focused && focusedStyle,
      ]}
      {...rest}
    >
      {children}
      {focused ? <View pointerEvents="none" style={styles.ring} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTargets.tv,
    borderRadius: radii.lg,
    borderWidth: 3,
    borderColor: "transparent",
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.accentSoft,
  },
});
