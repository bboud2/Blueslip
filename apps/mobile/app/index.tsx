import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Receipt } from "@blueslip/shared";
import { getDeviceReceipts } from "../lib/api";
import { getDeviceId } from "../lib/device";
import { colors, fonts } from "../lib/theme";

export default function ReceiptList() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReceipts = useCallback(async () => {
    setLoading(true);
    const deviceId = await getDeviceId();
    const data = await getDeviceReceipts(deviceId);
    setReceipts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (receipts.length === 0) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="receipt-long" size={48} color={colors.outlineVariant} />
        <Text style={styles.emptyTitle}>No receipts yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap your phone on a Blue Slip terminal to get your first receipt.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={receipts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 8 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={() => router.push(`/receipt/${item.id}`)}
        >
          <View style={styles.rowIcon}>
            <MaterialIcons name="receipt" size={24} color={colors.primary} />
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.storeName}>{item.store_name}</Text>
            <Text style={styles.date}>{formatDate(item.created_at)}</Text>
          </View>
          <Text style={styles.total}>{formatCents(item.total)}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: colors.background,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: colors.onSurface,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + "30",
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainer,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: colors.onSurface,
  },
  date: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  total: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: colors.onSurface,
  },
});
