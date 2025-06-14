import { BottomSheetFlashList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { ListRenderItemInfo } from "@shopify/flash-list";
import { LucideIcon } from "lucide-react-native";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomBackdrop from "../custom-backdrop";
import LucideIconButton from "../lucide-icon-button";
import { useIsDark } from "@/hooks/useColorScheme";
import { useColors } from "@/hooks/useColor";
import { defaultSpacing } from "@/constants/theme";

export interface IconPickerSheetProps {
  icons: [string, LucideIcon][];
  value?: null | string;
  onSelect?: (name: string) => void;
  snapPoints?: (string | number)[];
}

const IconPickerSheet = forwardRef<BottomSheetModal, IconPickerSheetProps>(
  ({ onSelect, value, snapPoints = ["50%", "100%"], icons }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const isDark = useIsDark();
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    useImperativeHandle(ref, () => sheetRef.current!, []);

    const { numOfColumns, itemWidth } = useMemo(() => {
      const safeWidth = width - insets.left - insets.right - defaultSpacing;
      const numOfColumns = Math.floor(safeWidth / 48);

      return {
        numOfColumns,
        itemWidth: Math.floor(
          (safeWidth - (defaultSpacing / 2) * (numOfColumns + 1)) / numOfColumns
        ),
      };
    }, [insets.left, insets.right, width]);

    const renderItem = useCallback(
      ({ item: [name, Icon] }: ListRenderItemInfo<[string, LucideIcon]>) => {
        const selected = !!value && value === name;
        return (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LucideIconButton
              selected={selected}
              Icon={Icon}
              style={{
                width: itemWidth,
                height: itemWidth,
              }}
              iconSize={itemWidth * 0.6}
              onPress={() => {
                onSelect?.(name);
                sheetRef.current?.dismiss();
              }}
            />
          </View>
        );
      },
      [itemWidth, onSelect, value]
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        backdropComponent={CustomBackdrop}
        enableDynamicSizing={false}
        index={0}
        topInset={insets.top}
        backgroundStyle={{
          backgroundColor: isDark ? colors.secondary : colors.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
        }}
      >
        <BottomSheetFlashList
          data={icons}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: defaultSpacing / 2,
            paddingBottom: insets.bottom + defaultSpacing / 2,
          }}
          numColumns={numOfColumns}
          ItemSeparatorComponent={() => (
            <View style={{ height: defaultSpacing / 2 }} />
          )}
          estimatedItemSize={56}
          keyExtractor={(item, index) => `${item[0]}-${index}`}
        />
      </BottomSheetModal>
    );
  }
);

IconPickerSheet.displayName = "IconPickerSheet";

export default IconPickerSheet;
