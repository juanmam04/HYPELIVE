import "react-native";

declare module "react-native" {
  interface PressableProps {
    /** tvOS / Android TV preferred focus */
    hasTVPreferredFocus?: boolean;
  }
}
