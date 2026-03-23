import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Receipt } from "@blueslip/shared";
import { getReceipt } from "../../lib/api";
import { colors } from "../../lib/theme";

export default function ReceiptDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getReceipt(id);
      setReceipt(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-CA", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading || !receipt) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Merchant header — centered, matches stitch mockup */}
      <View style={styles.merchantHeader}>
        <View style={styles.merchantIcon}>
          <MaterialIcons name="shopping-cart" size={36} color={colors.primary} />
        </View>
        <Text style={styles.storeName}>{receipt.store_name}</Text>
        <Text style={styles.storeAddress}>{receipt.store_address}</Text>
        <Text style={styles.date}>{formatDate(receipt.created_at)}</Text>
        <View style={styles.totalPill}>
          <Text style={styles.totalPillText}>{formatCents(receipt.total)}</Text>
        </View>
      </View>

      {/* Itemized breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ITEMS</Text>
        {receipt.line_items?.map((item) => (
          <View key={item.id} style={styles.lineItem}>
            <View style={styles.lineItemLeft}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              {formatCents(item.unit_price * item.quantity)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{formatCents(receipt.subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax</Text>
          <Text style={styles.totalValue}>{formatCents(receipt.tax)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalValue}>{formatCents(receipt.total)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  merchantHeader: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  merchantIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceContainerHighest,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  storeName: {
    fontSize: 26,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.onSurface,
    textAlign: "center",
  },
  storeAddress: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.onSurfaceVariant,
    marginTop: 4,
    textAlign: "center",
  },
  date: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  totalPill: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 9999,
    backgroundColor: colors.surfaceContainer,
  },
  totalPillText: {
    fontSize: 32,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.primary,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: colors.onSurfaceVariant,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  lineItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemName: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: colors.onSurface,
  },
  itemQty: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: colors.onSurfaceVariant,
  },
  itemPrice: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant + "40",
    marginVertical: 16,
    marginHorizontal: 16,
  },
  totalsSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: colors.onSurfaceVariant,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.onSurfaceVariant,
  },
  grandTotalLabel: {
    fontSize: 20,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.onSurface,
  },
  grandTotalValue: {
    fontSize: 20,
    fontFamily: "Manrope_800ExtraBold",
    color: colors.onSurface,
  },
});
