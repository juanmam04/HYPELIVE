import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors, sizes } from "@hypelive/design-tokens";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ color: focused ? colors.accent : colors.textMuted, fontSize: 11 }}>
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.ink },
        headerTintColor: colors.textPrimary,
        tabBarStyle: {
          backgroundColor: colors.charcoal,
          borderTopColor: colors.border,
          height: sizes.tabBarHeight + 12,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused }) => <TabIcon label="●" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="channels"
        options={{
          title: "Canales",
          tabBarIcon: ({ focused }) => <TabIcon label="▣" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="studio"
        options={{
          title: "Studio",
          tabBarIcon: ({ focused }) => <TabIcon label="▶" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => <TabIcon label="◎" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
