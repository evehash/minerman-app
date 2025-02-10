import Icon from "@/components/atoms/Icon";
import useTheme from "@/hooks/useTheme";
import type { ReactElement } from "react";
import { useState } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Option<T> {
  value: T;
  text: string;
}

interface SelectableListProps<T> {
  defaultValue: T;
  legend: string;
  options: Option<T>[];
  onChange(value: T): void;
}

function SelectableList<T>({ defaultValue, legend, options, onChange }: SelectableListProps<T>): ReactElement {
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState<T | null>(defaultValue);

  const renderOption: ListRenderItem<Option<T>> = ({ item: { text, value } }) => {
    const icon = value === selectedOption ? "circle" : "circle-outline";

    const handleOnPressOption = (): void => {
      if (value !== selectedOption) {
        onChange(value);
        setSelectedOption(value);
      }
    };

    return (
      <TouchableOpacity style={styles.option} onPress={handleOnPressOption}>
        <Icon name={icon} size={24} color={theme.primaryColor} />
        <Text style={[styles.optionText, { color: theme.primaryColor }]}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.legend, { color: theme.secondaryColor }]}>{legend}</Text>
      <FlatList data={options} renderItem={renderOption} contentContainerStyle={styles.listContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  legend: {
    fontSize: 14,
    fontWeight: "bold",
  },
  listContainer: {
    gap: 20,
    padding: 20,
  },
  option: {
    alignItems: "center",
    flexDirection: "row",
  },
  optionText: {
    fontSize: 17,
    marginLeft: 20,
  },
});

export default SelectableList;
