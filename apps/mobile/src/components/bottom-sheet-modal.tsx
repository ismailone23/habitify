import React, { ReactNode, RefObject, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface ModalProps {
  children: ReactNode;
  ref: RefObject<BottomSheetModal | null>;
}
export default function CustomBottomSheetModal({ children, ref }: ModalProps) {
  const snapPoints = useMemo(() => ["90%"], []);

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPoints}>
      {children}
    </BottomSheetModal>
  );
}
