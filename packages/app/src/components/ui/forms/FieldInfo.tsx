import type { AnyFieldApi } from "@tanstack/react-form";
import { Text } from "react-native";

export const FieldInfo: React.FC<{ field: AnyFieldApi }> = ({ field }) =>
  field.state.meta.isTouched && !field.state.meta.isValid ? (
    <Text className="text-red-500">
      {field.state.meta.errors.map(({ message }) => message).join(", ")}
    </Text>
  ) : null;
