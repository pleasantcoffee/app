import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const DefaultSheetView: React.FC<ViewProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <SafeAreaView edges={["top", "bottom"]}>
      <View className={`px-12 ${className}`} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
};
