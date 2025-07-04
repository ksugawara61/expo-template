import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Input } from "@/ui/Input";

export default function WindScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <MaterialCommunityIcons size={48} name="tailwind" color="#1AB3BA" />
      <Text className="text-2xl font-bold underline">Hello, NativeWind!</Text>
      <Input />
    </View>
  );
}
