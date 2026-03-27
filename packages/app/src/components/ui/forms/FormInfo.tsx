import type { StandardSchemaV1Issue } from "@tanstack/react-form";
import { Text } from "react-native";

interface FormInfoProps {
  formError: NoInfer<Record<string, StandardSchemaV1Issue[]> | undefined>;
}

export const FormInfo: React.FC<FormInfoProps> = ({ formError }) => {
  return formError && typeof formError === "string" ? (
    <Text className="text-red-500">{formError}</Text>
  ) : null;
};
