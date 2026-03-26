import type { StandardSchemaV1Issue } from "@tanstack/react-form";
import { Text } from "react-native";

interface FormInfoProps {
  formError: NoInfer<Record<string, StandardSchemaV1Issue[]> | undefined>;
}

export const FormInfo: React.FC<FormInfoProps> = ({ formError }) => {
  return formError ? (
    <Text className="text-red-500">{formError.toString()}</Text>
  ) : null;
};
